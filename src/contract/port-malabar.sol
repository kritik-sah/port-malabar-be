// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

/*
  Port Malabar – Box-Unique NFT (On-chain Metadata)
  ------------------------------------------------
  - ERC721 NFT
  - Fully on-chain tokenURI (base64 JSON)
  - Signature-based minting (no hot wallet)
  - One NFT per physical box (boxNo)
*/

import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/access/AccessControl.sol";
import "@openzeppelin/contracts/utils/Strings.sol";
import "@openzeppelin/contracts/utils/Base64.sol";
import "@openzeppelin/contracts/utils/cryptography/ECDSA.sol";
import "@openzeppelin/contracts/utils/cryptography/MessageHashUtils.sol";

contract PortMalabarBoxNFT is ERC721, AccessControl {
    using ECDSA for bytes32;
    using Strings for uint256;
    using MessageHashUtils for bytes32;

    bytes32 public constant MINTER_ROLE = keccak256("MINTER_ROLE");

    uint256 private _tokenIdCounter;

    string public constant COLLECTION_DESCRIPTION =
        "Port Malabar is a strategic board game inspired by the early colonial trade era of the Malabar Coast. Each NFT represents a unique physical game box.";

    /*//////////////////////////////////////////////////////////////
                            NFT DATA
    //////////////////////////////////////////////////////////////*/

    struct BoxMetadata {
        uint256 boxNo;
        string version; // V1, V2, etc
        string imageUrl; // CDN / IPFS / HTTPS
    }

    /// @notice Emitted when a box NFT is minted
    event BoxMinted(
        uint256 indexed boxNo,
        uint256 indexed tokenId,
        address indexed owner
    );

    mapping(uint256 => BoxMetadata) private _boxData;
    mapping(uint256 => bool) private _boxMinted;

    /// @notice Offline signer that authorizes mints
    address public trustedSigner;

    constructor(
        address admin,
        address signer
    ) ERC721("Port Malabar Box", "PMB") {
        trustedSigner = signer;
        _grantRole(DEFAULT_ADMIN_ROLE, admin);
        _grantRole(MINTER_ROLE, admin);
    }

    /*//////////////////////////////////////////////////////////////
                        SIGNATURE-BASED MINT
    //////////////////////////////////////////////////////////////*/

    /// @notice Mint NFT using backend signature (no hot wallet)
    function mintWithSignature(
        address to,
        uint256 boxNo,
        string calldata version,
        string calldata imageUrl,
        bytes calldata signature
    ) external returns (uint256) {
        require(!_boxMinted[boxNo], "Box already minted");

        bytes32 digest = keccak256(
            abi.encode(address(this), to, boxNo, version, imageUrl)
        ).toEthSignedMessageHash();

        address recovered = digest.recover(signature);
        require(recovered == trustedSigner, "Invalid signature");

        _boxMinted[boxNo] = true;

        uint256 tokenId = ++_tokenIdCounter;

        _boxData[tokenId] = BoxMetadata({
            boxNo: boxNo,
            version: version,
            imageUrl: imageUrl
        });

        _safeMint(to, tokenId);

        emit BoxMinted(boxNo, tokenId, to);
        return tokenId;
    }

    /*//////////////////////////////////////////////////////////////
                            METADATA
    //////////////////////////////////////////////////////////////*/

    function tokenURI(
        uint256 tokenId
    ) public view override returns (string memory) {
        require(_ownerOf(tokenId) != address(0), "Nonexistent token");

        BoxMetadata memory data = _boxData[tokenId];

        string memory json = Base64.encode(
            bytes(
                abi.encodePacked(
                    "{",
                    '"name":"Port Malabar Box #',
                    data.boxNo.toString(),
                    '",',
                    '"description":"',
                    COLLECTION_DESCRIPTION,
                    '",',
                    '"image":"',
                    data.imageUrl,
                    '",',
                    '"attributes":[',
                    '{"trait_type":"Box Number","value":"',
                    data.boxNo.toString(),
                    '"},',
                    '{"trait_type":"Version","value":"',
                    data.version,
                    '"}',
                    "]",
                    "}"
                )
            )
        );

        return string(abi.encodePacked("data:application/json;base64,", json));
    }

    /*//////////////////////////////////////////////////////////////
                        INTERFACE SUPPORT
    //////////////////////////////////////////////////////////////*/

    function supportsInterface(
        bytes4 interfaceId
    ) public view override(ERC721, AccessControl) returns (bool) {
        return super.supportsInterface(interfaceId);
    }
}
