# Dota NFTs - chainlink hackathon
Hi, I am Vishal, this is my project for **chainlink hackathon**.
Here you can create 2 NFTs :-
- Hero
- Item
	- each **Hero** will have its own attributes like **Strength**, **Agility**, **Intelligence**, **Damage**, **Armor**, etc.  which will be generated **randomly**.
	- each **Item** also have fixed attributes.
	- you can go for **battel** to level up your hero. which will increase your hero's **attributes**
	- In this project **ERC721** token is used and **chainlinks VRFConsumerBase** for randomness of heroes.
## Deployed at  https://wizardly-sinoussi-597c78.netlify.app

## Run project locally
- replace domain name with **localhost:3000**

> git clone https://github.com/vishalkale151071/dota-nft-client.git

> cd dota-nft-client

> npm install

>npm start

### Requirements
- Metamask
- Rinkeby network.
- You will need 0.001 eth for **Create hero**, **Create Item**, **levelUp** and ** Equip Item**.

### Create hero
- Go to https://wizardly-sinoussi-597c78.netlify.app/ . and activate your **metamask**.
- Fill the **seedvalue** with random number and give your hero a name.
- Click on **Create Hero** button.
- Accept the **metamask** transaction.
- Wait for some time an you'll see an **alert** that your hero is created.

### Create Item
- Go to https://wizardly-sinoussi-597c78.netlify.app/ . and activate your **metamask**.
- Fill the **seedvalue** with random number and give your hero a name.
- Click on **Create Item** button.
- Accept the **metamask** transaction.
- Wait for some time an you'll see an **alert** that your item is created.

### level-up Hero
-  Go to https://wizardly-sinoussi-597c78.netlify.app/ and **click** on your **hero image** on card. 
- You will be redirected to **hero details page**.
- There you'll see the **battle** button, click on it.
- Accept the **metamask** transaction.
- Wait for some time an you'll see an **alert** that your hero is leveled up.

### Equip Items
-  Go to https://wizardly-sinoussi-597c78.netlify.app/ and **click** on your **hero image** on card. 
- You will be redirected to **hero details page**.
- There you'll see the **Equip Item** button, click on it.
- Select the item you want to equip.
- Wait for some time and go to home page. your item will be in your hero card.

### See all created heroes
- Go to https://wizardly-sinoussi-597c78.netlify.app/heros

### sell all created items
- Go to https://wizardly-sinoussi-597c78.netlify.app/items
