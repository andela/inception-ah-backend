import crypto from "crypto";

export const encryptToken = () => {
  const timeEncoded = crypto.createCipher(
    "aes-128-cbc",
    process.env.JWT_SECRET
  );
  const timeIssued = new Date();
  let encodedTimeStamp = timeEncoded.update(
    timeIssued.toString(),
    "utf8",
    "hex"
  );
  encodedTimeStamp += timeEncoded.final("hex");
  return encodedTimeStamp;
};

export const decryptToken = token => {
  const timeDecoded = crypto.createDecipher(
    "aes-128-cbc",
    process.env.JWT_SECRET
  );
  let decodedTime = timeDecoded.update(token, "hex", "utf8");
  decodedTime += timeDecoded.final("utf8");

  return decodedTime;
};

export const getTimeDifference = time => {
  const timeIssued = new Date(time);
  const presentTime = new Date();
  const timeDifference = presentTime.getTime() - timeIssued.getTime();
  return timeDifference / 1000;
};
