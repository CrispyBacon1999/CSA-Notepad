import * as TbaApiV3Client from "tba-api-v3client-ts";

TbaApiV3Client.OpenAPI.HEADERS = {
    "X-TBA-Auth-Key": process.env.TBA_KEY,
};

export default TbaApiV3Client;
