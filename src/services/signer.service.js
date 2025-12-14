import { encodeAbiParameters, keccak256, parseAbiParameters } from "viem";
import { privateKeyToAccount } from "viem/accounts";

const signer = privateKeyToAccount(process.env.SIGNER_PRIVATE_KEY);

export function signMint(to, boxNo, version, imageUrl) {
  const hash = keccak256(
    encodeAbiParameters(
      parseAbiParameters("address,address,uint256,string,string"),
      [process.env.NFT_CONTRACT, to, boxNo, version, imageUrl]
    )
  );

  return signer.signMessage({ message: { raw: hash } });
}
