export const generateUsername = (fname, lname) => {
  const fullName = fname + " " + lname;
  const words = fullName.trim().toLowerCase().split(" ");
  if (words.length === 0) return "";

  let firstName = words[0];
  let lastName = words[words.length - 1];

  const useLastFirst = Math.random() < 0.5;
  let baseUsername = useLastFirst ? lastName + firstName[0] : firstName[0] + lastName;

  const chars = "._.0123456789.";
  let randomSuffix = Array.from({ length: 3 }, () => {
    const array = new Uint32Array(1);
    crypto.getRandomValues(array);
    return chars[array[0] % chars.length];
  }).join("");

  if(randomSuffix[0] === ".") {
    const safeStart = "0123456789_";
    const array = new Uint32Array(1);
    crypto.getRandomValues(array);
    randomSuffix = safeStart[array[0] % safeStart.length] + randomSuffix.slice(1);
  }

  if(randomSuffix.at(-1) === ".") {
    const safeEnd  = "0123456789_";
    const array = new Uint32Array(1);
    crypto.getRandomValues(array);
    randomSuffix = randomSuffix.slice(0, -1) + safeEnd[array[0] % safeEnd.length];
  }

  return baseUsername + randomSuffix;
};

export const generatePassword = () => {
  const length = 23;
  const chars =
    "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!@#$%^&*_+";

  const array = new Uint32Array(length);
  crypto.getRandomValues(array);

  return Array.from(array)
    .map(num => chars[num % chars.length])
    .join("");
};

