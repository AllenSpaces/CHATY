const isSequential = (str: string, step: number) => {
  for (let i = 1; i < str.length; i++) {
    if (str.charCodeAt(i) - str.charCodeAt(i - 1) !== step) return false;
  }
  return true;
};

export default function useWeekPasswordVerify(password: string) {
  if (isSequential(password, 1) || isSequential(password, -1)) {
    return true;
  } else if (new Set(password.split("")).size === 1) {
    return true;
  } else {
    return false;
  }
}
