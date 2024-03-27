import { STATES } from "@/constants";

export const extractCountries = (data: any, campaignId: string): IOption[] => {
  const countries = data[campaignId]["countries"];

  const selectedCountries = countries.map(
    ({ countryName, countryCode }: any) => ({
      label: countryName,
      id: countryCode
    })
  );
  return selectedCountries;
};

export const extractStates = (countries: IOption[]): IOption[] => {
  let statesSelected: IOption[] = [];

  const countryCodes: IOption["id"][] =
    countries.map(({ id }: IOption): IOption["id"] => id) ?? [];
  const options = STATES.filter((state) => {
    return countryCodes.includes(Object.keys(state)[0]);
  });

  options.forEach((country: any) => {
    const statesObj = country[Object.keys(country)[0]].states;

    const sanitizedArray: IOption[] = Object.keys(statesObj).map((stateKey) => {
      return {
        label: statesObj[stateKey],
        id: stateKey
      };
    });

    statesSelected = [...statesSelected, ...sanitizedArray];
  });

  return statesSelected;
};
