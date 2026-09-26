#!/usr/bin/env python3
"""Original royalty-free background tracks for Wren Hale Reels.
Everything here is synthesised from scratch (no samples), so the output is fully owned.
Writes <name>.wav files; ffmpeg handles loudness + mp3 afterwards.
"""
import numpy as np
from scipy.signal import butter, sosfilt
from scipy.io import wavfile

SR = 44100
RNG = np.random.default_rng(7)

NOTE = {n: i for i, n in enumerate(["C", "C#", "D", "D#", "E", "F", "F#", "G", "G#", "A", "A#", "B"])}
NOTE.update({"Db": 1, "Eb": 3, "Gb": 6, "Ab": 8, "Bb": 10})
QUAL = {"maj7": [0, 4, 7, 11], "m7": [0, 3, 7, 10], "7": [0, 4, 7, 10], "maj": [0, 4, 7, 12],
        "min": [0, 3, 7, 12], "m9": [0, 3, 7, 10, 14], "maj9": [0, 4, 7, 11, 14], "13": [0, 4, 10, 14, 21],
        "add9": [0, 4, 7, 14], "sus2": [0, 2, 7, 12]}


def hz(midi):
    return 440.0 * 2 ** ((midi - 69) / 12)


def chord(name, octave=4):
    for q in sorted(QUAL, key=len, reverse=True):
        if name.endswith(q) and name[:-len(q)] in NOTE:
            root = NOTE[name[:-len(q)]]
            return 12 * (octave + 1) + root, [12 * (octave + 1) + root + iv for iv in QUAL[q]]
    raise ValueError(name)


def lp(x, fc, order=2):
    return sosfilt(butter(order, fc, "low", fs=SR, output="sos"), x)


def hp(x, fc, order=2):
    return sosfilt(butter(order, fc, "high", fs=SR, output="sos"), x)


def bp(x, lo, hi):
    return sosfilt(butter(2, [lo, hi], "band", fs=SR, output="sos"), x)


def env(n, a=0.005, d=0.3, s=0.6, r=0.2, hold=None):
    hold = n if hold is None else min(hold, n)
    t = np.arange(n) / SR
    e = np.where(t < a, t / a, s + (1 - s) * np.exp(-(t - a) / max(d, 1e-3)))
    rel_start = hold / SR
    e = np.where(t > rel_start, e * np.exp(-(t - rel_start) / max(r, 1e-3)), e)
    return e


def epiano(f, dur, vel=0.5):
    n = int(dur * SR)
    t = np.arange(n) / SR
    mod = np.sin(2 * np.pi * f * 1.0 * t) * 1.2 * np.exp(-t * 3)
    x = np.sin(2 * np.pi * f * t + mod)
    x += 0.35 * np.sin(2 * np.pi * 2 * f * t) * np.exp(-t * 2.5)
    x += 0.12 * np.sin(2 * np.pi * 3.01 * f * t) * np.exp(-t * 6)
    trem = 1 + 0.12 * np.sin(2 * np.pi * 4.5 * t)
    return vel * x * trem * env(n, 0.004, 0.9, 0.35, 0.25, hold=int(n * 0.85))


def pad(f, dur, vel=0.25):
    n = int(dur * SR)
    t = np.arange(n) / SR
    x = sum(np.sin(2 * np.pi * f * (1 + det) * t + RNG.uniform(0, 6)) for det in (-0.004, 0, 0.005))
    return vel * x / 3 * env(n, 0.25, 1.0, 0.8, 0.4, hold=int(n * 0.9))


def pluck(f, dur, vel=0.45, bright=0.996):
    n = int(dur * SR)
    period = max(int(SR / f), 2)
    buf = RNG.uniform(-1, 1, period)
    out = np.empty(n)
    for i in range(n):
        out[i] = buf[i % period]
        buf[i % period] = bright * 0.5 * (buf[i % period] + buf[(i + 1) % period])
    return vel * out * env(n, 0.002, 0.5, 0.0, 0.1)


def bass(f, dur, vel=0.55):
    n = int(dur * SR)
    t = np.arange(n) / SR
    x = np.sin(2 * np.pi * f * t) + 0.25 * np.sin(2 * np.pi * 2 * f * t)
    x = np.tanh(1.6 * x)
    return vel * x * env(n, 0.006, 0.4, 0.7, 0.08, hold=int(n * 0.9))


def kick(vel=0.9):
    n = int(0.45 * SR)
    t = np.arange(n) / SR
    f = 45 + 95 * np.exp(-t * 28)
    ph = 2 * np.pi * np.cumsum(f) / SR
    click = RNG.uniform(-1, 1, n) * np.exp(-t * 400) * 0.3
    return vel * (np.sin(ph) * np.exp(-t * 7) + click)


def snare(vel=0.5, lofi=False):
    n = int(0.3 * SR)
    t = np.arange(n) / SR
    noise = bp(RNG.uniform(-1, 1, n), 1500 if lofi else 1800, 6000 if lofi else 9000) * np.exp(-t * (18 if lofi else 22))
    tone = np.sin(2 * np.pi * 190 * t) * np.exp(-t * 30)
    return vel * (noise * 1.4 + tone * 0.6)


def clap(vel=0.45):
    n = int(0.25 * SR)
    t = np.arange(n) / SR
    e = sum(np.where(t >= d, np.exp(-(t - d) * 60), 0) for d in (0, 0.008, 0.017)) + 0.6 * np.exp(-t * 14)
    return vel * bp(RNG.uniform(-1, 1, n), 900, 5000) * e


def hat(vel=0.18, open_=False):
    n = int((0.25 if open_ else 0.06) * SR)
    t = np.arange(n) / SR
    return vel * hp(RNG.uniform(-1, 1, n), 7000) * np.exp(-t * (14 if open_ else 70))


def shaker(vel=0.1):
    n = int(0.09 * SR)
    t = np.arange(n) / SR
    e = np.sin(np.pi * np.clip(t / 0.09, 0, 1)) ** 2
    return vel * hp(RNG.uniform(-1, 1, n), 5000) * e


def place(track, sig, start):
    i = int(start * SR)
    if i >= len(track):
        return
    j = min(len(track), i + len(sig))
    track[i:j] += sig[: j - i]


def vinyl(n):
    x = hp(RNG.uniform(-1, 1, n), 1000) * 0.012
    pops = np.zeros(n)
    idx = RNG.integers(0, n, n // SR * 6)
    pops[idx] = RNG.uniform(0.2, 0.6, len(idx)) * RNG.choice([-1, 1], len(idx))
    return x + lp(pops, 3000) * 0.5


def sidechain(n, kicks, depth=0.45, rel=0.18):
    g = np.ones(n)
    t = np.arange(int(rel * 2.5 * SR)) / SR
    curve = 1 - depth * np.exp(-t / rel * 2.2)
    for k in kicks:
        i = int(k * SR)
        j = min(n, i + len(curve))
        g[i:j] = np.minimum(g[i:j], curve[: j - i])
    return g


def build(spec):
    bpm, bars = spec["bpm"], spec["bars"]
    beat = 60 / bpm
    bar = 4 * beat
    total = bars * bar
    n = int((total + 1.5) * SR)
    keys = np.zeros(n); low = np.zeros(n); drums = np.zeros(n); lead = np.zeros(n)
    swing = spec.get("swing", 0.0)
    kicks = []
    prog = spec["prog"]
    for b in range(bars):
        t0 = b * bar
        root, notes = chord(prog[b % len(prog)], spec.get("oct", 4))
        style = spec["style"]
        # --- harmony
        if style == "lofi":
            for k, m in enumerate(notes):
                place(keys, epiano(hz(m), bar * 0.95, 0.16), t0 + k * 0.018 + RNG.uniform(0, 0.01))
            if b % 2 == 1:  # little re-strike on beat 3.5
                for m in notes[1:3]:
                    place(keys, epiano(hz(m + 12), beat * 1.2, 0.07), t0 + 2.5 * beat + swing * beat * 0.5)
        else:
            for m in notes[:4]:
                place(keys, pad(hz(m), bar, 0.10), t0)
            stab = [0, 1.5, 2.5, 3.5] if style == "pop" else [0.5, 1.5, 2.5, 3.5]
            for s in stab:
                for m in notes[:4]:
                    place(keys, epiano(hz(m + 12), beat * 0.45, 0.06), t0 + s * beat)
        # --- bass
        bpat = spec["bass"]
        for (pos, dur_b, off) in bpat:
            place(low, bass(hz(root - 24 + off), dur_b * beat, 0.5), t0 + pos * beat)
        # --- drums
        for s in range(16):  # 16th grid
            pos = s * beat / 4
            if s % 2 == 1:
                pos += swing * beat / 4
            tt = t0 + pos
            if s in spec["kick"]:
                place(drums, kick(0.85), tt); kicks.append(tt)
            if s in spec["snare"]:
                place(drums, clap(0.4) if style != "lofi" else snare(0.42, lofi=True), tt)
                if style != "lofi":
                    place(drums, snare(0.18), tt)
            if s in spec["hat"]:
                accent = 1.0 if s % 4 == 2 else 0.7
                place(drums, hat(0.12 * accent, open_=(style != "lofi" and s % 8 == 6)), tt)
            if style != "lofi" and s % 2 == 1:
                place(drums, shaker(0.05), tt)
        # --- lead melody (pop styles) from chord tones, 2-bar phrases
        if spec.get("lead") and b >= 2:
            pattern = spec["lead"][b % len(spec["lead"])]
            for (pos, idx, dur_b) in pattern:
                m = notes[idx % len(notes)] + 12 * (1 + idx // len(notes))
                place(lead, pluck(hz(m), dur_b * beat + 0.3, 0.22), t0 + pos * beat)
    # intro: drop drums in bar 1 for lofi (keys only), filter-in for pop
    if spec["style"] == "lofi":
        drums[: int(bar * SR)] *= 0.0
    g = sidechain(n, kicks, depth=0.35 if spec["style"] == "lofi" else 0.5)
    mix = keys * g * 1.0 + low * g * 0.9 + drums * 0.9 + lead * g * 0.8
    if spec["style"] == "lofi":
        mix = lp(mix, 5200) + vinyl(n)
        mix = mix * (1 + 0.004 * np.sin(2 * np.pi * 0.3 * np.arange(n) / SR))
    else:
        mix = lp(mix, 12000)
    mix = hp(mix, 30)
    # fade tail
    tail = int(1.2 * SR)
    mix[int(total * SR):int(total * SR) + tail] *= np.linspace(1, 0, tail)[: len(mix[int(total * SR):int(total * SR) + tail])]
    mix = mix[: int((total + 1.2) * SR)]
    fade_in = int(0.02 * SR)
    mix[:fade_in] *= np.linspace(0, 1, fade_in)
    mix = np.tanh(mix * 1.1) / np.max(np.abs(np.tanh(mix * 1.1))) * 0.89
    st = np.stack([mix, np.roll(mix, int(0.012 * SR)) * 0.96 + mix * 0.04], 1)  # light stereo width
    wavfile.write(spec["name"] + ".wav", SR, (st * 32767).astype(np.int16))
    print(spec["name"], round(total + 1.2, 1), "s")


LOFI_BASS = [(0, 1.5, 0), (1.75, 0.5, 7), (2.5, 1.5, 0)]
POP_BASS = [(0, 0.5, 0), (1, 0.5, 0), (1.5, 0.5, 12), (2, 0.5, 0), (3, 0.5, 0), (3.5, 0.5, 7)]
HOUSE_BASS = [(0.5, 0.5, 0), (1.5, 0.5, 0), (2.5, 0.5, 0), (3.5, 0.5, 12)]

TRACKS = [
    dict(name="wren-lofi-sunday", style="lofi", bpm=82, bars=10, swing=0.28, oct=4,
         prog=["Fmaj7", "Em7", "Dm7", "Cmaj7"], bass=LOFI_BASS,
         kick=[0, 7, 10], snare=[4, 12], hat=[0, 2, 4, 6, 8, 10, 12, 14]),
    dict(name="wren-lofi-coffee", style="lofi", bpm=76, bars=9, swing=0.32, oct=4,
         prog=["Am9", "Dm9", "G13", "Cmaj9"], bass=LOFI_BASS,
         kick=[0, 3, 8, 11], snare=[4, 12], hat=[0, 2, 4, 6, 8, 10, 12, 14]),
    dict(name="wren-pop-fresh-start", style="pop", bpm=112, bars=14, oct=4,
         prog=["Cadd9", "Gmaj", "Amin", "Fmaj7"], bass=POP_BASS,
         kick=[0, 4, 8, 12], snare=[4, 12], hat=[2, 6, 10, 14],
         lead=[[(0, 2, 0.5), (0.5, 1, 0.5), (1, 2, 1), (2.5, 3, 0.5), (3, 2, 1)],
               [(0, 1, 0.5), (0.5, 2, 0.5), (1.5, 0, 1), (3, 1, 1)]]),
    dict(name="wren-pop-move-in-day", style="pop", bpm=120, bars=15, oct=4,
         prog=["Dmaj", "Amaj", "Bmin", "Gmaj"], bass=POP_BASS,
         kick=[0, 4, 8, 12], snare=[4, 12], hat=[2, 6, 10, 14],
         lead=[[(0, 0, 0.5), (0.5, 1, 0.5), (1, 2, 0.5), (1.5, 3, 1), (3, 2, 0.5), (3.5, 1, 0.5)],
               [(0, 2, 1.5), (2, 1, 0.5), (2.5, 0, 1.5)]]),
    dict(name="wren-house-golden-hour", style="house", bpm=104, bars=13, oct=4,
         prog=["Ebmaj7", "Cm7", "Abmaj7", "Bb7"], bass=HOUSE_BASS,
         kick=[0, 4, 8, 12], snare=[4, 12], hat=[2, 6, 10, 14],
         lead=[[(0.5, 2, 0.5), (1.5, 3, 0.5), (2.5, 2, 0.5), (3.5, 1, 0.5)]]),
]

if __name__ == "__main__":
    for tr in TRACKS:
        build(tr)
