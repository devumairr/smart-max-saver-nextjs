export const isEmailValid = (email: string): boolean => {
  const emailRegex = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;

  return emailRegex.test(email.trim());
};

export const isNumberValid = (value: string): boolean => {
  return (
    !value.startsWith("1") &&
    value.length === 10 &&
    !isNaN(Number(value.trim()))
  );
};

export const isPostalCodeValid = (value: string): boolean => {
  return (
    value.trim().length > 0 &&
    value.trim().length <= 5 &&
    !isNaN(Number(value.trim()))
  );
};

export const isCardValid = (value: string): boolean => {
  const cardNumber = value.trim();

  const visaCardRegex = /^4\d{0,15}$/;
  const amexCardRegex = /^3[47]\d{0,13}$/;
  const mastercardRegex = /^5[1-5]\d{0,14}$/;
  const discoverCardRegex = /^(6011|622[1-9]|64[4-9]|65\d)\d{0,13}$/;

  return (
    visaCardRegex.test(cardNumber) ||
    amexCardRegex.test(cardNumber) ||
    mastercardRegex.test(cardNumber) ||
    discoverCardRegex.test(cardNumber)
  );
};

export const isCvvValid = (value: string): boolean => {
  return value.trim().length === 3 && !isNaN(Number(value.trim()));
};
