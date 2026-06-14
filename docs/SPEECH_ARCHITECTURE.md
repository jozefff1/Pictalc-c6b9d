# Speech Architecture

**Status:** Foundation implemented; neural providers planned
**Primary languages:** Norwegian Bokmal (`nb-NO`) and English (`en-US`)

Snakke treats text-to-speech (TTS) and speech-to-text (STT) as separate,
replaceable capabilities. Whisper is an STT model; it is not a TTS engine.

## Recommended Offline-First Stack

| Capability | Preferred offline provider | Immediate fallback | Optional online provider |
|---|---|---|---|
| TTS | Piper-compatible voice packs through Sherpa-ONNX WebAssembly | Browser `SpeechSynthesis` | Provider selected after privacy and processor review |
| STT | Multilingual Whisper through Transformers.js in a Web Worker | Browser `SpeechRecognition` | Provider selected after privacy and processor review |

The first use of a neural provider requires downloading a model. After the
model and runtime are cached, speech processing should remain on-device. The UI
must show download size, progress, installed languages, storage use, and whether
audio leaves the device.

## Why This Design

- Norwegian and English can use independently upgradeable model packs.
- Core AAC speech remains available immediately through installed browser/OS
  voices, even before a neural model is downloaded.
- On-device processing supports offline operation and reduces unnecessary audio
  transfer.
- A provider boundary allows better models or approved online providers to be
  introduced without changing communication features.
- Low-memory devices can continue using browser speech instead of loading large
  models.

## Implemented Foundation

- Central language-to-locale mapping in `src/lib/services/speechLocales.ts`
- Norwegian aliases covering `nb-NO`, `no-NO`, and `nn-NO`
- Browser voice selection that prefers the closest language and installed local
  voice
- Registerable TTS provider interface in `src/lib/services/speechService.ts`
- Browser speech retained as the zero-download fallback
- Sentence Builder, settings, and learning pronunciation use the shared service

## Provider Contract

A local neural TTS provider registers with `registerSpeechSynthesisProvider()`.
It should use a priority above the browser provider's priority of `0`, report
availability only after its model is installed, and fall back cleanly if model
loading or synthesis fails.

STT currently uses browser recognition. The next implementation step is an STT
provider contract and a worker-based multilingual Whisper provider.

## Online Candidate

Google Cloud Speech is the strongest initial online candidate to benchmark
because its current documentation lists Norwegian Bokmal for Chirp 3 HD TTS
and Norwegian speech recognition in a European region. It must remain opt-in
until audio/data flows, contracts, processing locations, retention, cost, and
quality are reviewed. Azure Speech and Amazon Polly should remain comparison
candidates during the benchmark.

## Model and Delivery Requirements

Before adding a model:

1. Verify engine, model, dataset, and voice licenses separately.
2. Test Norwegian intelligibility with representative native speakers.
3. Benchmark first download, cold start, latency, memory, and battery on target
   phones and tablets.
4. Store model version and checksum in a manifest.
5. Cache only explicit downloadable speech assets; do not cache authenticated
   API responses as part of model delivery.
6. Support model removal and upgrades without deleting user communication data.
7. Keep browser speech available when neural providers are unsupported.

## Proposed Delivery Order

1. Add a model manifest and speech-model storage manager.
2. Implement the Piper/Sherpa TTS provider in a dedicated Web Worker.
3. Evaluate Norwegian voice quality before making it the default.
4. Add the multilingual Whisper STT provider in a dedicated Web Worker.
5. Add settings for automatic, local neural, and browser speech modes.
6. Run offline, accessibility, privacy, and device-performance tests.

## Primary Technical References

- Sherpa-ONNX WebAssembly TTS:
  https://k2-fsa.github.io/sherpa/onnx/tts/wasm/index.html
- Sherpa-ONNX Piper model conversion:
  https://k2-fsa.github.io/sherpa/onnx/tts/piper.html
- Transformers.js supported tasks:
  https://huggingface.co/docs/transformers.js/en/index
- Piper voice models:
  https://huggingface.co/rhasspy/piper-voices
- Web Speech API specification:
  https://webaudio.github.io/web-speech-api/
- Google Cloud Chirp 3 HD language support:
  https://docs.cloud.google.com/text-to-speech/docs/chirp3-hd
- Google Cloud Speech-to-Text V2 language support:
  https://docs.cloud.google.com/speech-to-text/docs/speech-to-text-supported-languages
