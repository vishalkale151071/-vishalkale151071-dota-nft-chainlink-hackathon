pragma solidity '0.6.6.';

import '@chainlink/contracts/src/v0.6/VRFConsumerBase.sol';
import '@openzeppelin/contracts/token/ERC721/ERC721.sol';

contract Dota is VRFConsumerBase, ERC721 {
    
    address owner;

    uint256 internal fee;
    bytes32 internal keyHash;

    address public VRFCoordinator;
    address public LinkToken;

    struct Hero{
        uint8 heroCode;
        string name;
        uint16 damage;
        uint16 strength;
        uint16 agility;
        uint16 intelligence;
        uint16 hitPoints;
        uint16 mana;
        uint16 movementSpeed;
    }   
    Hero[] public heros;
    uint256 public number;
    mapping(bytes32 => string) requestToName;
    mapping(bytes32 => address) requestToSender;
    //mapping(bytes32 => uint256) requestToTokenId;

    constructor(address _VRFCoordinator, address _LinkToken, bytes32 _keyHash) public
    VRFConsumerBase(_VRFCoordinator, _LinkToken)
    ERC721("DefenceOfTheAncients", "DOTA")
    {
        VRFCoordinator = _VRFCoordinator;
        LinkToken = _LinkToken;
        keyHash = _keyHash;
        fee = 0.1 * 10**18; // 0.1 LINK
        owner = msg.sender;
    }

    function requestHero(uint256 _seed, string memory _name) public
    returns(bytes32) {
        require(
            LINK.balanceOf(address(this)) >= fee, "Not enough LINK - fill contract with faucet" );
        bytes32 requestId = requestRandomness(keyHash, fee, _seed);
        requestToName[requestId] = _name;
        requestToSender[requestId] = msg.sender;
        return(requestId);
    }

    function fulfillRandomness(bytes32 requestId, uint256 randomNumber)
    internal
    override {
        number = randomNumber;
        uint256 newId = heros.length;
        uint8 heroCode = uint8(randomNumber % 12 + 1);
        uint16 strength = uint16((randomNumber / 10000) % 25);
        uint16 intelligence = uint16((randomNumber / 10000000) % 25);
        uint16 agility = uint16((randomNumber / 1000) % 25);
        uint16 movementSpeed = uint16(200 + (randomNumber / 100000000000) % 100);   
        uint16 hitPoints = uint16(200 + strength * 20);
        uint16 mana = uint16(75 + intelligence * 11);
        uint16 damage = uint16(randomNumber % 30);
        
        if(heroCode < 5){
            damage += strength;
        }else if(heroCode < 9){
            damage += agility;
        }else{
            damage += intelligence;
        }

        heros.push(
            Hero(
                heroCode,
                requestToName[requestId],
                damage,
                strength,
                agility,
                intelligence,
                hitPoints,
                mana,
                movementSpeed
            )   
        );
        _safeMint(requestToSender[requestId], newId);
    }

    function getHero(uint256 id)
    public
    view
    returns(uint8, string memory, uint16, uint16, uint16, uint16, uint16, uint16, uint16){
        Hero memory hero = heros[id];
        return(hero.heroCode, hero.name, hero.damage, hero.strength, hero.agility, hero.intelligence, hero.hitPoints, hero.mana, hero.movementSpeed);
    }

    function withdrawLink() external {
        require(msg.sender == owner, "Only Owner can withdraw LINKs.");
        require(LINK.transfer(msg.sender, LINK.balanceOf(address(this))), "Unable to transfer");
    }

    function linkBalance() external 
    returns(uint256){
        return(LINK.balanceOf(address(this)));
    }
}