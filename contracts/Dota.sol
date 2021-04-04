pragma solidity '0.6.6';

import '@chainlink/contracts/src/v0.6/VRFConsumerBase.sol';// Random number
import '@openzeppelin/contracts/token/ERC721/ERC721.sol';// ERC721 

contract Dota is VRFConsumerBase, ERC721 {
    
    uint256 Id;
    
    address owner; // contract owner

    uint256 internal fee; //fee in LINK for chainlink
    bytes32 internal keyHash;   

    address public VRFCoordinator;
    address public LinkToken;

    // Structure Hero for creating heros
    struct Hero{
        uint256 tokenId;
        uint8 heroCode;
        string name;
        uint8 level;
        uint16 damage;
        uint16 armor;
        uint16 strength;
        uint16 agility;
        uint16 intelligence;
        uint16 hitPoints;
        uint16 mana;
        uint16 movementSpeed;
    }   
    Hero[] public heros;

    // Structure Item for creating items
    struct Item{
        uint256 tokenId;
        uint8 itemCode;
    }
    Item[] public items;
    
    mapping(bytes32 => string) requestToName;
    mapping(bytes32 => address) requestToSender;
    mapping(address => uint256[]) ownerToHeros;
    mapping(address => uint256[]) ownerToItems;
    mapping(bytes32 => uint8) requestFor;
    mapping(uint256 => uint256[6]) heroToItems;

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
        requestFor[requestId] = 0;
        return(requestId);
    }

    function requestItem(uint256 _seed) public
    returns(bytes32) {
        require(
            LINK.balanceOf(address(this)) >= fee, "Not enough LINK - fill contract with faucet" );
        bytes32 requestId = requestRandomness(keyHash, fee, _seed);
        requestToSender[requestId] = msg.sender;
        requestFor[requestId] = 1;
        return(requestId);
    }

    function fulfillRandomness(bytes32 requestId, uint256 randomNumber)
    internal
    override {       
        if(requestFor[requestId] == 0){
            uint16 strength = uint16((randomNumber / 10000) % 25);
            uint16 intelligence = uint16((randomNumber / 10000000) % 25);
            uint16 agility = uint16((randomNumber / 1000) % 25);   
            uint16 hitPoints = uint16(200 + strength * 20);
            uint16 mana = uint16(75 + intelligence * 11);
            uint16 damage = uint16(randomNumber % 30);
            uint256 newId = heros.length;
            uint8 heroCode = uint8(randomNumber % 12 + 1);
            if(heroCode < 5){
                damage += strength;
            }else if(heroCode < 9){
                damage += agility;
            }else{
                damage += intelligence;
            }
            
            heros.push(
                Hero(
                    Id++,
                    heroCode,
                    requestToName[requestId],
                    0,
                    damage,
                    uint16(randomNumber % 5),
                    strength,
                    agility,
                    intelligence,
                    hitPoints,
                    mana,
                    uint16(200 + (randomNumber / 100000000000) % 100)
                )   
            );
            
            _safeMint(requestToSender[requestId], Id);
            ownerToHeros[requestToSender[requestId]].push(newId);
        }else{
            uint256 newId = items.length;
            uint8 itemCode = uint8(randomNumber % 24 + 1);
            items.push(
            Item(
                Id++,
                itemCode
            )   
            );

            _safeMint(requestToSender[requestId], Id);
            ownerToItems[requestToSender[requestId]].push(newId);
        }
       
    }

    function getHeroFirstHalf(uint256 id)
    public
    view
    returns(uint8, string memory, uint8, uint16, uint16, uint16){
        require(id >= 0 && id < heros.length, "Hero does not exists.");
        Hero memory hero = heros[id];
        return(hero.heroCode, hero.name, hero.level,hero.damage, hero.strength, hero.agility);
    }

    function getHeroSecondHalf(uint256 id)
    public
    view
    returns(uint16, uint16, uint16, uint16, uint16, uint256){
        require(id >= 0 && id < heros.length, "Hero does not exists.");
        Hero memory hero = heros[id];
        return(hero.intelligence, hero.hitPoints, hero.mana, hero.movementSpeed, hero.armor, hero.tokenId);
    }

    function levelUp(uint256 _id)
    view
    external
    {
        require(msg.sender == ownerOf(heros[_id].tokenId), "Only owner of NFT can level-up the hero");
        Hero memory hero = heros[_id];
        hero.level += 1;
        hero.strength += 2;
        hero.agility += 2;
        hero.intelligence += 2;
        hero.hitPoints += 40;
        hero.mana += 22;
        hero.armor += 1;
    }

    function getItem(uint256 id)
    public
    view
    returns(uint8){
        require(id >= 0 && id < items.length, "Item does not exists.");
        Item memory item = items[id];
        return(item.itemCode);
    }

    function withdrawLink() 
    external{
        require(msg.sender == owner, "Only Owner can withdraw LINKs.");
        require(LINK.transfer(msg.sender, LINK.balanceOf(address(this))), "Unable to transfer");
    }

    function linkBalance() 
    external 
    view 
    returns(uint256){
        return(LINK.balanceOf(address(this)));
    }

    function getNFTCount(address _account)
    public
    view
    returns(uint256){
        return balanceOf(_account);
    }

    function getHeroCount()
    public
    view
    returns (uint256){
        return heros.length;
    }

    function getItemCount()
    public
    view
    returns (uint256){
        return items.length;
    }

    function getHeroNFTs(address _account)
    public
    view
    returns(uint256[] memory){
        return ownerToHeros[_account];
    }

    function getItemNFTs(address _account)
    public
    view
    returns(uint256[] memory){
        return ownerToItems[_account];
    }
}