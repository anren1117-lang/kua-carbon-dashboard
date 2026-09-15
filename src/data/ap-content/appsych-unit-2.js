// AP Psychology Unit 2 — Cognition (15-25%)

export const APPSYCH_UNIT_2 = {
  number: 2,
  title: 'Cognition',
  weight: '15-25%',
  subunits: [
    {
      code: '2.1',
      title: 'Sensation and perception',
      content:
`**Sensation.** Receiving and detecting stimuli (e.g., light hits eye).
**Perception.** Brain organizing and interpreting (e.g., recognizing a face).

**Bottom-up processing.** Start with sensory data; build up to perception.
**Top-down processing.** Start with expectations and prior knowledge; interpret.

**Sensory thresholds.**
- **Absolute threshold**: minimum stimulation detected 50% of time.
- **Difference threshold (JND)**: minimum difference between two stimuli detected 50% of time.
- **Weber\'s Law**: JND is proportional to original stimulus (constant ratio).

**Sensory adaptation.** Decreased sensitivity to constant stimulus (smell goes away after time in a room).

**Vision.**
- Light enters cornea → pupil → lens → focused on retina.
- **Retina** has rods (peripheral, low-light, B&W) and cones (color, daylight, sharp).
- **Fovea**: center of retina, mostly cones, highest acuity.
- Optic nerve carries signal to brain.
- **Blind spot**: where optic nerve exits retina; no receptors.

**Color theories.**
- **Trichromatic** (Young-Helmholtz): three cone types — red, green, blue.
- **Opponent process** (Hering): cells respond in opposing pairs (red-green, blue-yellow, white-black). Explains afterimages.

**Hearing.** Sound waves: amplitude (loudness, dB), frequency (pitch, Hz). Outer → middle (eardrum, ossicles) → inner (cochlea, hair cells) → auditory nerve.

**Other senses.** Touch, taste (5 tastes: sweet, sour, salty, bitter, umami), smell (most direct path to memory/emotion), proprioception (body position), vestibular (balance).`,
    },
    {
      code: '2.2',
      title: 'Perception — Gestalt and depth',
      content:
`**Gestalt principles.** The whole is different from sum of parts. We organize sensory input.

- **Proximity**: things close together perceived as group.
- **Similarity**: similar things grouped.
- **Continuity**: prefer smooth continuous patterns.
- **Closure**: fill in gaps to perceive whole.
- **Figure-ground**: distinguish object (figure) from background (ground).

**Depth perception.** Seeing in 3D from 2D images on retina.

**Binocular cues** (require both eyes):
- **Retinal disparity**: each eye sees slightly different image.
- **Convergence**: eyes turn inward for close objects.

**Monocular cues**:
- **Relative size**: smaller appears farther.
- **Interposition**: blocking object is closer.
- **Linear perspective**: parallel lines converge in distance.
- **Texture gradient**: texture less detailed in distance.
- **Atmospheric perspective**: distant objects hazier.
- **Motion parallax**: closer objects move faster as you move.

**Perceptual constancy.** Objects appear stable despite changes in retinal image.
- **Size constancy**: object same size regardless of distance.
- **Shape constancy**: door appears rectangular at any angle.
- **Color constancy**: apple looks red in different lighting.

**Perceptual set.** Mental predisposition affects perception. What we expect to see, we see.

**Visual illusions.** Reveal perceptual processes.
- Müller-Lyer arrows: same length lines appear different.
- Ponzo illusion: railroad tracks make far line look bigger.
- Stroop effect: word interferes with color naming.`,
    },
    {
      code: '2.3',
      title: 'Memory — three-stage model',
      content:
`**Atkinson-Shiffrin model:** Sensory memory → Short-term memory → Long-term memory.

**Sensory memory.** Brief storage of sensory information.
- **Iconic** (visual): ~1/4 second.
- **Echoic** (auditory): ~3-4 seconds.

**Short-term memory (STM) / working memory.**
- Capacity: ~7 ± 2 items (Miller\'s magic number).
- Duration: ~20-30 seconds without rehearsal.
- **Chunking** expands capacity by grouping (phone number 8005551234 as 800-555-1234).
- **Working memory** model (Baddeley): adds processing, not just storage.

**Long-term memory (LTM).** Vast capacity, potentially lifelong duration.

**LTM types:**
- **Explicit (declarative)**: conscious recall.
  - **Episodic**: personal events.
  - **Semantic**: facts, general knowledge.
- **Implicit (procedural)**: unconscious. Skills, conditioned responses.

**Encoding** (getting in).
- **Effortful**: requires attention.
- **Automatic**: happens without effort.
- **Levels of processing**: deeper processing (meaning) → better memory than shallow (visual).

**Spacing effect.** Distributed practice beats cramming.
**Testing effect.** Practicing recall improves retention.

**Retrieval cues.** External or internal stimuli that trigger memory.
- **Priming**: prior exposure activates related concepts.
- **State-dependent learning**: easier to recall in similar state (mood, location).
- **Mood-congruent memory**: easier to recall memories matching current mood.`,
    },
    {
      code: '2.4',
      title: 'Forgetting and memory errors',
      content:
`**Forgetting curve** (Ebbinghaus). Rapid forgetting initially, slower over time.

**Why we forget:**
- **Encoding failure**: never properly encoded.
- **Storage decay**: memory fades over time.
- **Retrieval failure**: can\'t access stored memory.
- **Interference**:
  - **Proactive**: old learning interferes with new (calling new partner old partner\'s name).
  - **Retroactive**: new learning interferes with old (learning Spanish messes up French).

**Tip-of-the-tongue.** Knowing something but unable to retrieve.

**Memory errors.**
- **Misinformation effect** (Loftus): post-event information distorts memory.
- **Source amnesia**: remember information, forget where it came from.
- **Constructive memory**: we reconstruct memories, often inaccurately.
- **Schemas**: existing knowledge structures shape what we remember.

**Eyewitness testimony** is notoriously unreliable.
- Leading questions distort.
- Cross-race identifications worse.
- Confident eyewitnesses can be wrong.
- DNA evidence has exonerated many wrongly convicted by eyewitnesses.

**Repressed memories.** Highly debated. Some recovered "memories" later shown false. Therapy can implant false memories.

**Amnesia.**
- **Retrograde**: lose memories before injury.
- **Anterograde**: can\'t form new memories (Henry Molaison, "H.M." — hippocampus removed).`,
    },
    {
      code: '2.5',
      title: 'Thinking, problem solving, and language',
      content:
`**Concepts.** Mental categories. **Prototypes**: best examples of concepts.

**Problem solving strategies:**
- **Algorithms**: step-by-step rules guaranteed to work.
- **Heuristics**: shortcuts that often work.
- **Insight**: sudden realization ("aha!").

**Common heuristics:**
- **Availability heuristic**: judge based on easily-recalled examples. Why we overestimate plane crash risk (memorable) and underestimate car crash risk (mundane).
- **Representativeness heuristic**: judge by similarity to stereotype.
- **Anchoring**: rely heavily on first information.
- **Framing effect**: same info presented differently leads to different decisions.

**Obstacles to problem solving:**
- **Mental set**: stuck on solution that worked before.
- **Functional fixedness**: see object as having only its usual function.
- **Confirmation bias**: seek evidence supporting belief; ignore disconfirming.
- **Belief perseverance**: hold beliefs despite contradictory evidence.

**Language.**
- **Phonemes**: smallest sound units (~40 in English).
- **Morphemes**: smallest meaning units.
- **Grammar**: rules for combining.
- **Syntax**: word order.
- **Semantics**: meaning.

**Language acquisition.**
- **Babbling stage**: ~4 months.
- **One-word stage**: ~1 year.
- **Two-word (telegraphic) stage**: ~2 years.
- Complete sentences by 3-4.

**Chomsky**: language acquisition device (LAD); innate capacity.
**Linguistic relativity (Sapir-Whorf)**: language shapes thought. Disputed.

**Critical periods**: easier to learn language in childhood.`,
    },
  ],
  keyConcepts: [
    'Sensation = receive; perception = interpret.',
    'Vision: rods (peripheral, B&W) + cones (color, fovea).',
    'Color: trichromatic (cones) + opponent-process (downstream cells).',
    'Gestalt principles organize perception (proximity, similarity, closure).',
    'Memory: sensory → STM (7±2) → LTM (vast).',
    'Explicit (declarative) vs implicit (procedural) memory.',
    'Forgetting: encoding failure, decay, retrieval failure, interference.',
    'Eyewitness memory is reconstructive and often unreliable.',
    'Heuristics (availability, representativeness, anchoring) shortcut decisions but err.',
    'Confirmation bias, framing, mental set bias thinking.',
  ],
  practice: [
    {
      q: 'You can\'t remember someone\'s name. After someone mentions a clue, it suddenly comes back. What concept is this?',
      a: 'Retrieval cue helps access memory. The information was stored (no encoding/storage failure) but retrieval failed until the cue triggered it.',
    },
    {
      q: 'Why is eyewitness testimony unreliable?',
      a: 'Memory is reconstructive. Misinformation effect (post-event info distorts), source amnesia, schemas shape recall, leading questions influence answers.',
    },
  ],
  pitfalls: [
    '"Sensation = perception" — wrong. Sensation is bottom-up reception; perception is interpretation.',
    '"Memory is like a video recording" — wrong. Memory is constructive and changes over time.',
    '"Algorithms always better than heuristics" — algorithms guaranteed correct but slow; heuristics fast but error-prone. Trade-off.',
  ],
};
