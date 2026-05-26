export const pascalCaseFormat = (val) => {
  return val
    .split(/\s+/)
    .map(word =>
      word.charAt(0).toUpperCase() + word.slice(1).toLowerCase()
    )
    .join(" ");
}

export const sliceToOne = (val) => {
  return val.split("")[0];
}

export const currentSemester = () => {
  const month = new Date().getMonth() + 1;
  const day = new Date().getDate();

  if((month >= 1 && month <= 4) || (month === 5 && day <= 14)) return "2nd sem";
  if((month >= 7 && month <= 11) || (month === 12 && day <= 14)) return "1st sem";
  else return "Sem break";

  return null;
}

export const currentAcYear = () => {
  const now = new Date();
  const year = now.getFullYear();
  const month = now.getMonth();

  let startYear;

  if (month >= 7) {
    startYear = year;
  } else {
    startYear = year - 1;
  }

  const fromYear = (startYear % 100).toString().padStart(2, "0");
  const toYear = ((startYear + 1) % 100).toString().padStart(2, "0");

  const academicYear = `${fromYear}/${toYear}`;

  return academicYear;
}