# Small Sounds — Insect Listening Exhibit

A family-friendly, browser-based prototype for an insect listening exhibit. It includes four interactive synthetic sound demos, local playback of an audio file selected by the visitor, and live microphone waveform visualization.

## Run locally

Microphone access requires a secure context (usually HTTPS or localhost).

```bash
cd insect-listening-exhibit
python3 -m http.server 8000
```

Open http://localhost:8000 in a browser. Headphones are recommended when using a microphone.

## What works

- Four synthetic audio demonstrations inspired by insect sound concepts.
- Visitor-selected audio file playback (the file stays local in the browser).
- Live microphone waveform visualization through the Web Audio API.
- Responsive layout, keyboard focus styles, accessible labels, and microphone permission/error states.

## Important scientific note

The demo sounds are synthesized tones, not authentic recordings of crickets, bees, beetles, or leaf-dwelling insects. Do not label them as actual species recordings. Add authentic audio with verified identifications and provenance before using this as a public science exhibit.

## Add recordings

Keep the original recording and its metadata together. For every asset, document at least:
- Species or best-supported identification (including uncertainty)
- Recorder / contributor and recording date
- Location at an appropriate privacy-safe level
- Recording equipment and processing, if known
- License and attribution requirements

Only publish audio you have permission to redistribute. A future curated version can include a locally hosted recordings directory and an accessible playlist with descriptions and citations.

## Next steps

1. Add properly licensed, scientifically verified insect recordings.
2. Add a visible recording playlist with source and license details.
3. Test with children and families, including keyboard-only use and screen readers.
4. For true field listening, connect a suitable contact microphone, piezo sensor, or ultrasonic detector to a local computer or microcontroller.
5. If integrating with Orcasound / Orcabooth, coordinate with maintainers and follow upstream licenses and contribution practices.

## Relationship to Orcasound

This is an independent prototype inspired by the broad idea of a public listening exhibit. It is not an official Orcasound project and does not copy upstream source code. Please verify the current license and attribution requirements of any upstream code before adapting or reusing it.

## License

The independently written starter code in this directory is offered under the MIT License. Third-party audio assets, if added later, may have separate terms.
