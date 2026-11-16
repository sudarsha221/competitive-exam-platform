import type { PracticeExam } from "@/components/practice/practice-data";

type ChallengeSeed = [
  subject: string,
  topic: string,
  prompt: string,
  options: [string, string, string, string],
  correctIndex: number,
  explanation: string,
];

export type DailyQuestion = {
  id: string;
  exam: PracticeExam;
  day: number;
  subject: string;
  topic: string;
  prompt: string;
  options: [string, string, string, string];
  correctIndex: number;
  explanation: string;
};

const neetSeeds: ChallengeSeed[] = [
  ["Biology", "Cell biology", "Which organelle modifies and packages proteins for transport?", ["Lysosome", "Golgi apparatus", "Ribosome", "Centrosome"], 1, "The Golgi apparatus modifies, sorts, and packages proteins received from the endoplasmic reticulum."],
  ["Biology", "Genetics", "A heterozygous monohybrid cross under complete dominance gives which phenotypic ratio?", ["1:1", "1:2:1", "3:1", "9:3:3:1"], 2, "Aa × Aa gives three dominant-phenotype offspring for each recessive-phenotype offspring."],
  ["Chemistry", "Chemical bonding", "What is the molecular shape of ammonia, NH₃?", ["Linear", "Trigonal planar", "Trigonal pyramidal", "Tetrahedral"], 2, "Three bonding pairs and one lone pair around nitrogen give a trigonal-pyramidal molecular shape."],
  ["Physics", "Laws of motion", "The change in momentum produced by a force acting over time is called what?", ["Work", "Impulse", "Power", "Torque"], 1, "Impulse equals force multiplied by time and, by the impulse–momentum theorem, equals change in momentum."],
  ["Physics", "Energy", "In free fall without air resistance, what happens to total mechanical energy?", ["It increases", "It decreases", "It stays constant", "It becomes zero"], 2, "Potential energy converts to kinetic energy while their total remains constant."],
  ["Biology", "Plant physiology", "Which pigment directly captures most light energy for photosynthesis?", ["Chlorophyll a", "Anthocyanin", "Carotene only", "Xanthophyll only"], 0, "Chlorophyll a is the primary photosynthetic pigment at reaction centres."],
  ["Biology", "Cell biology", "Which organelle is the principal site of aerobic ATP production?", ["Golgi body", "Mitochondrion", "Lysosome", "Nucleolus"], 1, "The mitochondrial inner membrane hosts oxidative phosphorylation, producing most aerobic ATP."],
  ["Biology", "Molecular biology", "Which enzyme separates DNA strands at a replication fork?", ["Ligase", "Helicase", "Amylase", "Peptidase"], 1, "Helicase unwinds the double helix by separating complementary DNA strands."],
  ["Biology", "Human physiology", "Where does most gas exchange between air and blood take place in the lungs?", ["Trachea", "Bronchi", "Alveoli", "Pleura"], 2, "Thin-walled alveoli provide a large surface area for diffusion of oxygen and carbon dioxide."],
  ["Biology", "Human physiology", "Which structure is the functional filtration unit of the kidney?", ["Neuron", "Nephron", "Alveolus", "Villus"], 1, "Each nephron filters blood and carries out selective reabsorption and secretion."],
  ["Biology", "Endocrinology", "Which pancreatic hormone lowers blood glucose by promoting cellular uptake?", ["Glucagon", "Insulin", "Thyroxine", "Adrenaline"], 1, "Insulin promotes glucose uptake and storage, lowering blood glucose concentration."],
  ["Biology", "Cell division", "During which mitotic phase do sister chromatids separate?", ["Prophase", "Metaphase", "Anaphase", "Telophase"], 2, "Centromeres divide during anaphase, allowing sister chromatids to move to opposite poles."],
  ["Biology", "Plant transport", "Which plant tissue carries water from roots toward leaves?", ["Phloem", "Xylem", "Epidermis", "Cortex"], 1, "Xylem conducts water and dissolved minerals upward from the roots."],
  ["Biology", "Plant physiology", "The Calvin cycle takes place in which part of the chloroplast?", ["Thylakoid lumen", "Stroma", "Outer membrane", "Granum space"], 1, "The light-independent carbon-fixation reactions occur in the chloroplast stroma."],
  ["Biology", "Molecular biology", "Which RNA molecule carries amino acids to a ribosome during translation?", ["mRNA", "tRNA", "rRNA", "snRNA"], 1, "Transfer RNA carries a specific amino acid and pairs its anticodon with an mRNA codon."],
  ["Biology", "Cell transport", "Water moving across a selectively permeable membrane is an example of what?", ["Active transport", "Osmosis", "Endocytosis", "Exocytosis"], 1, "Osmosis is the net movement of water across a selectively permeable membrane."],
  ["Biology", "Genetics", "Which blood group allele is recessive in the ABO system?", ["Iᴬ", "Iᴮ", "i", "Iᴬ and Iᴮ"], 2, "The i allele is recessive; Iᴬ and Iᴮ are codominant with one another."],
  ["Biology", "Nervous system", "A rapid, automatic response to a stimulus is called what?", ["A reflex action", "A learned response", "A voluntary action", "A hormone cycle"], 0, "A reflex action is a rapid involuntary response, often coordinated through a reflex arc."],
  ["Biology", "Plant physiology", "Through which structures does most gas exchange occur in a leaf?", ["Lenticels", "Stomata", "Root hairs", "Petioles"], 1, "Stomata are pores controlled by guard cells that regulate gas exchange and water loss."],
  ["Biology", "Enzymes", "Why can very high temperatures reduce an enzyme's activity?", ["They increase substrate size", "They denature its active site", "They create more enzymes", "They remove all water"], 1, "Excess heat disrupts the enzyme's structure and changes the shape of its active site."],
  ["Biology", "Ecology", "A collection of populations of different species living in one area forms a what?", ["Community", "Biome", "Species", "Biosphere"], 0, "A community includes interacting populations of multiple species in a particular area."],
  ["Biology", "Molecular biology", "What is the process of synthesizing a protein from an mRNA template called?", ["Replication", "Transcription", "Translation", "Mutation"], 2, "During translation, ribosomes read mRNA codons and assemble the corresponding amino-acid chain."],
  ["Biology", "Immunity", "Which cells produce antibodies after activation by an antigen?", ["B lymphocytes", "Red blood cells", "Platelets", "Osteocytes"], 0, "Activated B lymphocytes differentiate into plasma cells that secrete antibodies."],
  ["Biology", "Human physiology", "Which part of the heart normally initiates each heartbeat?", ["AV node", "SA node", "Bundle branches", "Purkinje fibres"], 1, "The sinoatrial node acts as the heart's normal pacemaker."],
  ["Biology", "Plant hormones", "Which plant hormone is strongly associated with cell elongation and phototropism?", ["Auxin", "Ethylene", "Abscisic acid", "Cytokinin"], 0, "Auxin promotes cell elongation and its uneven distribution helps shoots bend toward light."],
  ["Biology", "Cellular respiration", "What is the respiratory quotient for complete oxidation of glucose?", ["0.7", "0.8", "1.0", "1.5"], 2, "For glucose, equal moles of carbon dioxide are released and oxygen consumed, giving RQ = 1."],
  ["Biology", "Human physiology", "Where does the loop of Henle lie in a nephron?", ["Between the PCT and DCT", "Inside the glomerulus", "After the collecting duct", "Within the renal pelvis"], 0, "The loop of Henle connects the proximal and distal convoluted tubules."],
  ["Biology", "Cell division", "Crossing over between homologous chromosomes occurs in which meiotic stage?", ["Prophase I", "Metaphase I", "Anaphase II", "Telophase II"], 0, "Crossing over occurs during pachytene of prophase I in meiosis."],
  ["Biology", "Biotechnology", "Which enzyme is used to amplify a chosen DNA segment in PCR?", ["DNA ligase", "Taq DNA polymerase", "RNA polymerase", "Reverse transcriptase only"], 1, "Heat-stable Taq DNA polymerase extends primers during repeated PCR cycles."],
  ["Biology", "Ecology", "In an ideal energy pyramid, which trophic level contains the most energy?", ["Top consumers", "Secondary consumers", "Primary consumers", "Producers"], 3, "Producers capture energy at the base; only a fraction passes to each higher trophic level."],
];

const cetSeeds: ChallengeSeed[] = [
  ["Mathematics", "Differential calculus", "What is the derivative of x² + 3x with respect to x?", ["2x + 3", "x + 3", "2x² + 3", "x² + 3"], 0, "Differentiate term by term: d(x²)/dx = 2x and d(3x)/dx = 3."],
  ["Mathematics", "Probability", "A fair die is rolled once. What is the probability of getting a number greater than 4?", ["1/6", "1/3", "1/2", "2/3"], 1, "The favourable outcomes are 5 and 6, so the probability is 2/6 = 1/3."],
  ["Physics", "Current electricity", "A 4 Ω resistor is connected across 12 V. What current flows?", ["0.33 A", "3 A", "8 A", "48 A"], 1, "Ohm's law gives I = V/R = 12/4 = 3 A."],
  ["Chemistry", "Organic chemistry", "Which functional group is present in ethanol?", ["Aldehyde", "Carboxyl", "Hydroxyl", "Ketone"], 2, "Ethanol contains an –OH hydroxyl group, characteristic of alcohols."],
  ["Mathematics", "Algebra", "What is the sum of the roots of 2x² − 5x + 3 = 0?", ["−5/2", "3/2", "5/2", "−3/2"], 2, "For ax² + bx + c = 0, the sum of roots is −b/a = 5/2."],
  ["Mathematics", "Coordinate geometry", "What is the slope of the line through (1, 2) and (3, 6)?", ["1", "2", "3", "4"], 1, "The slope is (6 − 2)/(3 − 1) = 2."],
  ["Physics", "Kinematics", "An object starts from rest and accelerates at 2 m/s² for 5 s. What is its final speed?", ["5 m/s", "10 m/s", "12 m/s", "25 m/s"], 1, "Using v = u + at gives v = 0 + 2 × 5 = 10 m/s."],
  ["Chemistry", "Atomic structure", "How many protons are in a neutral carbon-12 atom?", ["6", "8", "12", "18"], 0, "Carbon's atomic number is 6, which equals its number of protons."],
  ["Mathematics", "Trigonometry", "What is sin 30°?", ["0", "1/2", "√3/2", "1"], 1, "The standard trigonometric value of sin 30° is 1/2."],
  ["Physics", "Waves", "What is the SI unit of frequency?", ["Metre", "Hertz", "Watt", "Decibel"], 1, "Frequency is measured in hertz, equivalent to cycles per second."],
  ["Chemistry", "Acids and bases", "At 25°C, what is the pH of a neutral aqueous solution?", ["0", "5", "7", "14"], 2, "At 25°C, a neutral solution has equal hydrogen and hydroxide concentrations and pH 7."],
  ["Mathematics", "Sequences", "What is the 10th term of an AP with first term 5 and common difference 3?", ["29", "30", "32", "35"], 2, "aₙ = a₁ + (n−1)d = 5 + 9 × 3 = 32."],
  ["Physics", "Work and energy", "What is the kinetic energy of a 2 kg body moving at 3 m/s?", ["6 J", "9 J", "12 J", "18 J"], 1, "Kinetic energy is ½mv² = ½ × 2 × 3² = 9 J."],
  ["Chemistry", "Chemical bonding", "What type of bond forms when atoms share electron pairs?", ["Ionic", "Covalent", "Metallic", "Hydrogen"], 1, "A covalent bond is formed by sharing one or more pairs of electrons."],
  ["Mathematics", "Differential calculus", "What is the derivative of sin x with respect to x?", ["−cos x", "cos x", "sin x", "−sin x"], 1, "The standard derivative of sin x is cos x."],
  ["Physics", "Electricity", "What is the equivalent resistance of 2 Ω and 4 Ω resistors in series?", ["2 Ω", "3 Ω", "6 Ω", "8 Ω"], 2, "Series resistances add directly: 2 + 4 = 6 Ω."],
  ["Chemistry", "Periodic table", "Which element has atomic number 1?", ["Helium", "Hydrogen", "Lithium", "Oxygen"], 1, "Hydrogen is the first element in the periodic table and has atomic number 1."],
  ["Mathematics", "Statistics", "What is the arithmetic mean of 2, 4, 6, and 8?", ["4", "5", "6", "20"], 1, "The mean is (2 + 4 + 6 + 8)/4 = 5."],
  ["Physics", "Optics", "Which type of lens converges parallel rays of light?", ["Concave lens", "Convex lens", "Plane glass", "Prism"], 1, "A convex lens converges parallel rays toward its principal focus."],
  ["Chemistry", "Mole concept", "Approximately how many particles are in one mole of a substance?", ["6.022 × 10²³", "3.00 × 10⁸", "9.81 × 10²", "1.66 × 10⁻²⁷"], 0, "One mole contains Avogadro's number, approximately 6.022 × 10²³ entities."],
  ["Mathematics", "Coordinate geometry", "What is the distance between (0, 0) and (3, 4)?", ["4", "5", "6", "7"], 1, "The distance is √(3² + 4²) = 5."],
  ["Physics", "Thermal physics", "What is the SI unit of temperature?", ["Celsius", "Fahrenheit", "Kelvin", "Joule"], 2, "The SI base unit for thermodynamic temperature is the kelvin."],
  ["Chemistry", "Chemical reactions", "Oxidation is commonly described as what change in electrons?", ["Gain of electrons", "Loss of electrons", "Sharing of neutrons", "Gain of protons"], 1, "Oxidation is loss of electrons; reduction is gain of electrons."],
  ["Mathematics", "Logarithms", "What is log₁₀(1000)?", ["2", "3", "10", "100"], 1, "Since 10³ = 1000, log₁₀(1000) = 3."],
  ["Physics", "Electromagnetism", "What is the SI unit of magnetic flux?", ["Tesla", "Weber", "Henry", "Coulomb"], 1, "Magnetic flux is measured in webers (Wb)."],
  ["Chemistry", "Solutions", "What is the molarity of 1 mole of solute in 2 litres of solution?", ["0.25 M", "0.5 M", "1 M", "2 M"], 1, "Molarity is moles per litre: 1/2 = 0.5 M."],
  ["Mathematics", "Integration", "What is an indefinite integral of 2x with respect to x?", ["x² + C", "2x² + C", "x + C", "2 + C"], 0, "Because d(x²)/dx = 2x, an antiderivative is x² + C."],
  ["Physics", "Momentum", "What is the momentum of a 3 kg object moving at 4 m/s?", ["7 kg·m/s", "12 kg·m/s", "16 kg·m/s", "24 kg·m/s"], 1, "Momentum p = mv = 3 × 4 = 12 kg·m/s."],
  ["Chemistry", "Gases", "At constant temperature, which law relates pressure and volume inversely?", ["Charles' law", "Boyle's law", "Avogadro's law", "Dalton's law"], 1, "Boyle's law states that pressure is inversely proportional to volume at constant temperature."],
  ["Mathematics", "Matrices", "What is the determinant of the 2×2 identity matrix?", ["0", "1", "2", "−1"], 1, "The identity matrix has diagonal entries 1 and determinant 1 × 1 − 0 × 0 = 1."],
];

const jeeSeeds: ChallengeSeed[] = [
  ["Physics", "Projectile motion", "For a projectile launched at speed u and angle θ on level ground, what is its time of flight?", ["u cos θ/g", "2u sin θ/g", "u² sin 2θ/g", "2u cos θ/g"], 1, "The vertical component is u sin θ; the round-trip time is 2u sin θ/g."],
  ["Mathematics", "Sequences and series", "An AP has first term 5 and common difference 3. What is its 10th term?", ["29", "30", "32", "35"], 2, "The nth term is a + (n−1)d = 5 + 9 × 3 = 32."],
  ["Chemistry", "Chemical equilibrium", "For N₂ + 3H₂ ⇌ 2NH₃, what does increased pressure favour at constant temperature?", ["Reactants", "Ammonia", "Neither side", "A larger equilibrium constant"], 1, "The product side has fewer gas moles, so increased pressure shifts equilibrium toward NH₃."],
  ["Physics", "Rotational mechanics", "What is the moment of inertia of a point mass m at distance r from an axis?", ["mr", "mr²", "m²r", "½mr²"], 1, "For a point mass, moment of inertia I = mr²."],
  ["Mathematics", "Limits", "What is limₓ→0 (sin x)/x when x is measured in radians?", ["0", "1", "∞", "Does not exist"], 1, "This is a standard fundamental trigonometric limit equal to 1."],
  ["Chemistry", "Thermodynamics", "For a spontaneous process at constant temperature and pressure, what is true of ΔG?", ["ΔG > 0", "ΔG = 0 always", "ΔG < 0", "ΔG = ΔH"], 2, "A spontaneous process at constant temperature and pressure has negative Gibbs free-energy change."],
  ["Physics", "Electrostatics", "If the distance between two point charges doubles, how does the Coulomb force change?", ["Doubles", "Halves", "Becomes one quarter", "Quadruples"], 2, "Coulomb force varies as 1/r², so doubling r reduces force to one quarter."],
  ["Mathematics", "Complex numbers", "What is the modulus of 3 + 4i?", ["1", "4", "5", "7"], 2, "The modulus is √(3² + 4²) = 5."],
  ["Chemistry", "Chemical kinetics", "For a first-order reaction, what is the unit of its rate constant?", ["mol L⁻¹ s⁻¹", "s⁻¹", "L mol⁻¹ s⁻¹", "mol² L⁻² s⁻¹"], 1, "A first-order rate constant has dimensions of inverse time, commonly s⁻¹."],
  ["Physics", "Waves", "In a medium, wave speed v, frequency f, and wavelength λ are related by which expression?", ["v = fλ", "v = f/λ", "v = λ/f", "v = f + λ"], 0, "Wave speed equals frequency multiplied by wavelength: v = fλ."],
  ["Mathematics", "Vectors", "What is the dot product of perpendicular vectors?", ["1", "−1", "0", "Their magnitudes multiplied"], 2, "A·B = |A||B|cos θ; at 90°, cos θ = 0."],
  ["Chemistry", "Atomic structure", "How many orbitals are present in a p subshell?", ["1", "3", "5", "7"], 1, "A p subshell has three orbitals, corresponding to magnetic quantum numbers −1, 0, and +1."],
  ["Physics", "Gravitation", "At a distance 2R from Earth's centre, gravitational field strength is what fraction of its surface value?", ["1/2", "1/4", "1/8", "2"], 1, "Outside a spherical mass, g varies as 1/r²; at 2R it is one quarter."],
  ["Mathematics", "Binomial theorem", "What is the coefficient of x² in (1 + x)⁵?", ["5", "10", "15", "20"], 1, "The x² coefficient is the binomial coefficient C(5,2) = 10."],
  ["Chemistry", "Electrochemistry", "How many faradays of charge are required to deposit 1 mole of Ag from Ag⁺?", ["½ F", "1 F", "2 F", "3 F"], 1, "Ag⁺ + e⁻ → Ag requires one mole of electrons, equal to one faraday per mole."],
  ["Physics", "Oscillations", "What is the time period of a mass–spring system with mass m and spring constant k?", ["2π√(m/k)", "2π√(k/m)", "√(mk)", "2πmk"], 0, "For a mass–spring oscillator, T = 2π√(m/k)."],
  ["Mathematics", "Differential equations", "The order of d²y/dx² + (dy/dx)³ + y = 0 is what?", ["1", "2", "3", "6"], 1, "The highest derivative present is the second derivative, so the order is 2."],
  ["Chemistry", "Coordination compounds", "What is the coordination number of cobalt in [Co(NH₃)₆]³⁺?", ["3", "4", "6", "9"], 2, "Six monodentate NH₃ ligands are attached to cobalt, giving coordination number 6."],
  ["Physics", "Magnetism", "What is the magnetic force on a stationary point charge in a magnetic field?", ["qB", "qvB", "Zero", "Infinite"], 2, "Magnetic force q(v × B) is zero when the charge's velocity is zero."],
  ["Mathematics", "Probability", "Two independent events have probabilities 1/2 and 1/3. What is the probability both occur?", ["1/6", "1/5", "2/5", "5/6"], 0, "For independent events, multiply probabilities: (1/2)(1/3) = 1/6."],
  ["Chemistry", "Organic chemistry", "Which reagent commonly oxidizes a primary alcohol to an aldehyde under controlled conditions?", ["PCC", "NaBH₄", "H₂/Ni", "Aqueous NaCl"], 0, "PCC is a mild oxidizing agent that can convert a primary alcohol to an aldehyde."],
  ["Physics", "Modern physics", "The de Broglie wavelength of a particle is given by which expression?", ["h/p", "p/h", "hp", "hE"], 0, "The de Broglie relation gives wavelength λ = h/p."],
  ["Mathematics", "Coordinate geometry", "What is the radius of the circle x² + y² − 6x + 8y = 0?", ["3", "4", "5", "7"], 2, "Completing squares gives (x−3)² + (y+4)² = 25, so the radius is 5."],
  ["Chemistry", "Chemical bonding", "What is the hybridization of carbon atoms in ethene, C₂H₄?", ["sp", "sp²", "sp³", "dsp²"], 1, "Each carbon forms three sigma bonds in a trigonal-planar arrangement, so it is sp² hybridized."],
  ["Physics", "Optics", "For a thin lens in air, what is the relation between focal length f and power P in dioptres?", ["P = f", "P = 1/f (metres)", "P = f²", "P = 100f"], 1, "Lens power in dioptres is the reciprocal of focal length measured in metres."],
  ["Mathematics", "Determinants", "If two rows of a determinant are interchanged, what happens to its value?", ["It is unchanged", "It changes sign", "It becomes zero", "It is squared"], 1, "Interchanging any two rows (or columns) changes the sign of a determinant."],
  ["Chemistry", "Solutions", "For a dilute solution, Raoult's law gives solvent vapour pressure as what?", ["xₛPₛ°", "Pₛ°/xₛ", "xₛ + Pₛ°", "Pₛ° − xₛ"], 0, "The partial vapour pressure of the solvent is its mole fraction multiplied by pure-solvent vapour pressure."],
  ["Physics", "Thermodynamics", "For an ideal gas undergoing an isothermal process, what is the change in internal energy?", ["Positive", "Negative", "Zero", "Equal to work"], 2, "Ideal-gas internal energy depends only on temperature, which is constant in an isothermal process."],
  ["Mathematics", "Integration", "What is ∫₀¹ 2x dx?", ["0", "1", "2", "½"], 1, "An antiderivative is x²; evaluating from 0 to 1 gives 1."],
  ["Chemistry", "Periodic trends", "Across a period from left to right, effective nuclear charge generally does what?", ["Decreases", "Increases", "Stays exactly constant", "Becomes zero"], 1, "Proton number rises across a period while added electrons enter the same main shell, so effective nuclear charge generally increases."],
];

function createQuestions(exam: PracticeExam, seeds: ChallengeSeed[]): DailyQuestion[] {
  return seeds.map(([subject, topic, prompt, options, correctIndex, explanation], index) => ({
    id: `${exam.toLowerCase()}-challenge-${index + 1}`,
    exam,
    day: index + 1,
    subject,
    topic,
    prompt,
    options,
    correctIndex,
    explanation,
  }));
}

export const dailyChallenges: Record<PracticeExam, DailyQuestion[]> = {
  CET: createQuestions("CET", cetSeeds),
  NEET: createQuestions("NEET", neetSeeds),
  JEE: createQuestions("JEE", jeeSeeds),
};

export const sampleCompletedDays: Record<PracticeExam, number[]> = {
  CET: [1, 2, 3, 5, 6, 7, 8, 10, 11, 12, 13, 14, 15],
  NEET: [1, 2, 3, 4, 6, 7, 8, 9, 10, 12, 13, 14, 15],
  JEE: [1, 2, 4, 6, 8, 9, 12, 14, 15],
};

export const challengeExams: PracticeExam[] = ["CET", "NEET", "JEE"];
