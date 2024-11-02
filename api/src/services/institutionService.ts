// institutionService.js
import { client } from "../config/plaid";
import { CountryCode } from "plaid";

export const getInstitutionDetails = async (accessToken: any) => {
  const item = await client.itemGet({ access_token: accessToken });

  if (item.data.item.institution_id) {
    const institution = await client.institutionsGetById({
      institution_id: item.data.item.institution_id,
      country_codes: [CountryCode.Us],
    });

    return {
      name: institution.data.institution.name,
      id: item.data.item.institution_id,
    };
  }

  return null;
};
