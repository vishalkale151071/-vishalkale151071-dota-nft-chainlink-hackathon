pragma solidity '0.6.6';

import '@chainlink/contracts/src/v0.6/VRFConsumerBase.sol';// Random number
import '@openzeppelin/contracts/token/ERC721/ERC721.sol';// ERC721 

contract Dota is VRFConsumerBase, ERC721 {
    
    uint256 Id; // Token_Id for NFT
    
    address owner; // contract owner

    uint256 internal fee; //fee in LINK for chainlink
    bytes32 internal keyHash;   

    address VRFCoordinator;
    address LinkToken;

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
    Hero[] heros; // array of heros

    // Structure Item for creating items
    struct Item{
        uint256 tokenId;
        uint8 itemCode;
    }
    Item[] items;// array of items
    
    mapping(bytes32 => string) requestToName;
    mapping(bytes32 => address) requestToSender;
    mapping(address => uint256[]) ownerToHeros; // mapping for owners to their heros
    mapping(address => uint256[]) ownerToItems; // mapping for owners to their items
    mapping(bytes32 => uint8) requestFor; // mapping for which request is made for item or hero
    mapping(uint256 => uint256[]) heroToItems; // mapping for hero to infused items
    mapping(uint256 => bool) equippedItems; //check if items is equiped or not

    // modifiers start
    modifier existingItem(uint256 _id){
        require(_id >= 0 && _id < items.length, "Item does not exists.");
        _;
    }

    modifier existingHero(uint256 _id){
        require(_id >= 0 && _id < heros.length, "Hero does not exists.");
        _;
    }

    modifier heroOwnerOnly(uint256 _id){
        require(msg.sender == ownerOf(heros[_id].tokenId), "Only owner of NFT can do this operation");
        _;
    }

     modifier itemOwnerOnly(uint256 _id){
        require(msg.sender == ownerOf(items[_id].tokenId), "Only owner of NFT can do this operation");
        _;
    }

    // modifiers ends
    
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
    returns(bytes32) { // function to create random hero
        require(LINK.balanceOf(address(this)) >= fee, "Not enough LINK - fill contract with faucet" );
        bytes32 requestId = requestRandomness(keyHash, fee, _seed);
        requestToName[requestId] = _name;
        requestToSender[requestId] = msg.sender;
        requestFor[requestId] = 0;
        return(requestId);
    }

    function requestItem(uint256 _seed) public
    returns(bytes32) { //function to create random item
        require(LINK.balanceOf(address(this)) >= fee, "Not enough LINK - fill contract with faucet" );
        bytes32 requestId = requestRandomness(keyHash, fee, _seed);
        requestToSender[requestId] = msg.sender;
        requestFor[requestId] = 1;
        return(requestId);
    }

    function fulfillRandomness(bytes32 requestId, uint256 randomNumber)
    internal
    override { // fulfilling the callback function
        Id++; // increment token before minting so no NFT '0'   
        if(requestFor[requestId] == 0){
            uint16 strength = uint16((randomNumber / 10000) % 25);
            uint16 intelligence = uint16((randomNumber / 10000000) % 25);
            uint16 agility = uint16((randomNumber / 1000) % 25);   
            uint16 hitPoints = uint16(200 + strength * 20);
            uint16 mana = uint16(75 + intelligence * 11);
            uint16 damage = uint16(randomNumber % 30);
            uint256 newId = heros.length;
            uint8 heroCode = uint8(randomNumber % 12 + 1); // there are total 12 heros
            if(heroCode < 5){
                damage += strength;
            }else if(heroCode < 9){
                damage += agility;
            }else{
                damage += intelligence;
            }
            
            heros.push(
                Hero(
                    Id, // tokenId
                    heroCode,
                    requestToName[requestId],// name
                    0, // level
                    damage,
                    uint16(randomNumber % 5), //armor
                    strength, 
                    agility,
                    intelligence,
                    hitPoints,
                    mana,
                    uint16(200 + (randomNumber / 100000000000) % 100) // movementSpeed
                )   
            );
            
            _safeMint(requestToSender[requestId], Id);
            ownerToHeros[requestToSender[requestId]].push(newId); //push array index in owned heros
        }else{
            uint256 newId = items.length;
            uint8 itemCode = uint8(randomNumber % 24 + 1); // there are total 24 items
            items.push(
            Item(
                Id, // tokenId
                itemCode
            )   
            );

            _safeMint(requestToSender[requestId], Id);
            ownerToItems[requestToSender[requestId]].push(newId); // push array index in owned items
        }
       
    }

    function getHeroFirstHalf(uint256 _id) // returns half datea of hero
    public
    view
    existingHero(_id)
    returns(uint8, string memory, uint8, uint16, uint16, uint16){
        Hero memory hero = heros[_id];
        return(hero.heroCode, hero.name, hero.level,hero.damage, hero.strength, hero.agility);
    }

    function getHeroSecondHalf(uint256 _id) // returns remailning data of hero
    public
    view
    existingHero(_id)
    returns(uint16, uint16, uint16, uint16, uint16, uint256){
        Hero memory hero = heros[_id];
        return(hero.intelligence, hero.hitPoints, hero.mana, hero.movementSpeed, hero.armor, hero.tokenId);
    }

    function getItem(uint256 _id) // get item of perticular index form items array
    public
    view
    existingItem(_id)
    returns(uint8, uint256){
        return(items[_id].itemCode, items[_id].tokenId);
    }

    function levelUp(uint256 _id) //function to level up hero add 1 level and 2 to each attrinute
    public
    existingHero(_id){
        require(heros[_id].level <= 30, "You are At Max level");
        heros[_id].level += 1;
        heros[_id].strength += 2;
        heros[_id].agility += 2;
        heros[_id].intelligence += 2;
        heros[_id].hitPoints += 40;
        heros[_id].mana += 22;
        heros[_id].armor += 1;
        heros[_id].damage += 2;
    }

    function withdrawLink() // withdraw link from contract
    external{
        require(msg.sender == owner, "Only Owner can withdraw LINKs.");
        require(LINK.transfer(msg.sender, LINK.balanceOf(address(this))), "Unable to transfer");
    }

    function linkBalance() // check the LINK balance of contract
    external 
    view 
    returns(uint256){
        return(LINK.balanceOf(address(this)));
    }

    function getHeroOwner(uint256 _id)
    public
    view
    existingHero(_id)
    returns(address){
        return(ownerOf(heros[_id].tokenId));
    }

    function getItemOwner(uint256 _id)
    public
    view
    existingItem(_id)
    returns(address){
        return(ownerOf(items[_id].tokenId));
    }

    function getNFTCount(address _account)// return the total number of nfts owned by user
    public
    view
    returns(uint256){
        return balanceOf(_account);
    }

    function getHeroCount()// return total numbers of heros
    public
    view
    returns (uint256){
        return heros.length;
    }

    function getItemCount()// returns the total number of items
    public
    view
    returns (uint256){
        return items.length;
    }

    function getHeroNFTs(address _account) // returns the index of heros from array heros owned by user
    public
    view
    returns(uint256[] memory){
        return ownerToHeros[_account];
    }

    function getItemNFTs(address _account) // returns the index of items from array items owned by user
    public
    view
    returns(uint256[] memory){
        return ownerToItems[_account];
    }

    function equipItem(uint256 _heroId, uint256 _itemId,uint16 _strength, uint16 _agility, uint16 _intelligence, uint16 _damage, uint16 _armor, uint16 _mana, uint16 _movementSpeed)
    public
    existingHero(_heroId)
    existingItem(_itemId)
    heroOwnerOnly(_heroId)
    itemOwnerOnly(_itemId){
        require(heroToItems[_heroId].length < 7, "Maximum 6 items can be infused");
        require(equippedItems[_itemId] == false, "Item is already equipped.");
        heros[_heroId].strength += _strength;
        heros[_heroId].agility += _agility;
        heros[_heroId].intelligence += _intelligence;
        heros[_heroId].hitPoints += (_strength * 20);
        heros[_heroId].mana += (_intelligence * 11);
        updateRest(_heroId, _damage, _armor, _mana, _movementSpeed);
        heroToItems[_heroId].push(_itemId); // add the item id in items of hero mapping.
        equippedItems[_itemId] = true;
    }

    function updateRest(uint256 _heroId, uint16 _damage, uint16 _armor, uint16 _mana, uint16 _movementSpeed)
    internal{
                heros[_heroId].damage += _damage;
        heros[_heroId].armor += _armor;
        heros[_heroId].mana += _mana;
        heros[_heroId].movementSpeed += _movementSpeed;
    }

    function getEquippedItems(uint256 _id)
    public
    view
    existingHero(_id)
    returns(uint256[] memory, uint8[] memory){
        uint256[] memory item = heroToItems[_id];
        uint256[] memory ids = new uint256[](item.length);
        uint8[] memory codes = new uint8[](item.length);
        for(uint8 i=0;i<item.length;i++){
            ids[i] = item[i];
            codes[i] = items[item[i]].itemCode;
        }

        return (ids, codes);
    }
}