import { Blockchain, SandboxContract, TreasuryContract } from '@ton/sandbox';
import { beginCell, Cell, toNano } from '@ton/core';
import { MyContract } from '../wrappers/MyContract';

import '@ton/test-utils';
import { compile } from '@ton/blueprint';
import { stringify } from 'querystring';

describe('MyContract', () => {
    let code: Cell;

    beforeAll(async () => {
        code = await compile('MyContract');
    });

    let blockchain: Blockchain;
    let deployer: SandboxContract<TreasuryContract>;
    let myContract: SandboxContract<MyContract>;

    beforeEach(async () => {
        blockchain = await Blockchain.create();

        myContract = blockchain.openContract(MyContract.createFromConfig({}, code));

        deployer = await blockchain.treasury('deployer');

        const deployResult = await myContract.sendDeploy(deployer.getSender(), toNano('0.05'));
       
      
        expect(deployResult.transactions).toHaveTransaction({
            from: deployer.address,
            to: myContract.address,
            deploy: true,
            success: true,
        });
    });
    
    it('should deploy', async () => {
        /*
        const body = beginCell().storeUint(0,32).storeStringTail("AAAAHello Im here").endCell();
        const sendResult = await deployer.send({
            to: myContract.address,
            value: toNano('0.01'), // Số TON được gửi
            body: body, // Nội dung giao dịch
            
        });
        */
        //await myContract.mint_tokens();

        
    });
    it('should mint', async () => {
        await myContract.getOwner();
        //console.log(await myContract.getOwner());
       // console.log(currentOwnerAddress.toString());  // Chuyển Address sang chuỗi nếu cần
        
        
        
    });
});
