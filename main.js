/**
 * Generuje finální seznam zaměstnanců podle vstupního DTO.
 * @param {{
 *   count: number,
 *   age: { min: number, max: number }
 * }} dtoIn - Vstupní objekt s počtem zaměstnanců a rozmezím věku.
 * @returns {Array<Employee>} Seznam vygenerovaných zaměstnanců.
 */
export function main(dtoIn) {
  const { count, age } = dtoIn;
  if (!dtoIn || typeof count !== "number" || !age) return [];

  const dtoOut = [];
  const usedBirthdates = new Set();

  for (let i = 0; i < count; i++) {
    const gender = getGender(i);
    const workload = getWorkload(i);
    const name = getName(i, gender);
    const surname = getSurname(i, gender);
    const birthdate = generateUniqueBirthdate(age, usedBirthdates);

    dtoOut.push({
      gender,
      birthdate,
      name,
      surname,
      workload
    });
  }

  return dtoOut;
}

/**
 * Popisuje jednoho zaměstnance.
 * @typedef {object} Employee
 * @property {"male"|"female"} gender - Pohlaví zaměstnance.
 * @property {string} birthdate - Datum narození ve formátu ISO string.
 * @property {string} name - Křestní jméno zaměstnance.
 * @property {string} surname - Příjmení zaměstnance.
 * @property {10|20|30|40} workload - Úvazek v hodinách týdně.
 */

/**
 * Vrací pohlaví zaměstnance. Prvních N zaměstnanců (kde N je počet prvků
 * v poli pohlaví) dostane každý jeden typ pohlaví, zbytek je vybírán náhodně.
 * @param {number} index - Index zaměstnance v generovaném seznamu.
 * @returns {"male"|"female"} Pohlaví zaměstnance.
 */
function getGender(index) {
  const genders = ["male", "female"];

  if (index < genders.length) {
    // Zajistí, že se každý gender objeví alespoň jednou.
    return genders[index];
  }

  // Od tohoto indexu dál se vybírá pohlaví náhodně.
  return genders[randomInt(genders.length)];
}

/**
 * Vrací pracovní úvazek zaměstnance. Prvních N zaměstnanců (kde N je počet
 * prvků v poli úvazků) dostane každý jiný úvazek, zbytek je vybírán náhodně.
 * @param {number} index - Index zaměstnance v generovaném seznamu.
 * @returns {10|20|30|40} Úvazek zaměstnance v hodinách týdně.
 */
function getWorkload(index) {
  const workloads = [10, 20, 30, 40];

  if (index < workloads.length) {
    // Zajistí, že se každý workload objeví alespoň jednou.
    return workloads[index];
  }

  // Od tohoto indexu dál se workload vybírá náhodně.
  return workloads[randomInt(workloads.length)];
}

/**
 * Vrací mužské nebo ženské křestní jméno podle pohlaví.
 * Prvních N indexů používá hodnoty přímo z pole, od N dál je výběr náhodný.
 * @param {number} index - Index zaměstnance v generovaném seznamu.
 * @param {"male"|"female"} gender - Pohlaví, pro které se jméno vybírá.
 * @returns {string} Vybrané křestní jméno.
 */
function getName(index, gender) {
  const maleNames = [
    "Jan", "Petr", "Jakub", "Michal", "Ondřej",
    "David", "Tomáš", "Filip", "Martin", "Lukáš",
    "Marek", "Karel", "Václav", "Roman", "Adam", "Matěj"
  ];

  const femaleNames = [
    "Lucie", "Marie", "Anna", "Tereza", "Eva",
    "Kateřina", "Barbora", "Veronika", "Adéla",
    "Kristýna", "Karolína", "Marcela", "Hana",
    "Zuzana", "Jana", "Nikola"
  ];

  const list = gender === "male" ? maleNames : femaleNames;

  if (index < list.length) {
    return list[index];
  }

  return list[randomInt(list.length)];
}

/**
 * Vrací příjmení podle pohlaví.
 * Prvních N indexů používá hodnoty přímo z pole, od N dál je výběr náhodný.
 * @param {number} index - Index zaměstnance v generovaném seznamu.
 * @param {"male"|"female"} gender - Pohlaví, pro které se příjmení vybírá.
 * @returns {string} Vybrané příjmení.
 */
function getSurname(index, gender) {
  const male = [
    "Novák", "Svoboda", "Novotný", "Dvořák", "Černý",
    "Procházka", "Kučera", "Veselý", "Horák", "Němec",
    "Marek", "Pokorný", "Pavlík", "Sýkora", "Král", "Růžička"
  ];

  const female = [
    "Nováková", "Svobodová", "Novotná", "Dvořáková", "Černá",
    "Procházková", "Kučerová", "Veselá", "Horáková", "Němcová",
    "Marková", "Pokorná", "Pavlíková", "Sýkorová", "Králová", "Růžičková"
  ];

  const list = gender === "male" ? male : female;

  if (index < list.length) {
    return list[index];
  }

  return list[randomInt(list.length)];
}

/**
 * Generuje unikátní datum narození v zadaném věkovém rozmezí.
 * @param {{min: number, max: number}} age - Objekt s minimálním a maximálním věkem.
 * @param {Set<number>} usedBirthdates - Množina již použitých timestampů narození.
 * @returns {string} Unikátní datum narození ve formátu ISO string.
 */
function generateUniqueBirthdate(age, usedBirthdates) {
  const now = new Date();
  const min = new Date(now);
  const max = new Date(now);

  min.setFullYear(min.getFullYear() - age.max);
  max.setFullYear(max.getFullYear() - age.min);

  const minTime = min.getTime();
  const maxTime = max.getTime();
  const diff = maxTime - minTime;

  let ts;
  do {
    ts = minTime + Math.floor(Math.random() * diff);
  } while (usedBirthdates.has(ts));

  usedBirthdates.add(ts);
  return new Date(ts).toISOString();
}

/**
 * Vrátí náhodné celé číslo z intervalu <0, max).
 * @param {number} max - Horní mez intervalu (exkluzivně).
 * @returns {number} Náhodně vygenerované celé číslo.
 */
function randomInt(max) {
  return Math.floor(Math.random() * max);
}
