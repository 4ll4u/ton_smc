import { Address, beginCell, Cell, Contract, contractAddress, ContractProvider, Sender, SendMode, Tuple } from '@ton/core';

export type MyContractConfig = {};

export function myContractConfigToCell(config: MyContractConfig): Cell {
    return beginCell().endCell();
}

export class MyContract implements Contract {
    constructor(readonly address: Address, readonly init?: { code: Cell; data: Cell }) {}

    static createFromAddress(address: Address) {
        return new MyContract(address);
    }

    static createFromConfig(config: MyContractConfig, code: Cell, workchain = 0) {
        const data = myContractConfigToCell(config);
        const init = { code, data };
        return new MyContract(contractAddress(workchain, init), init);
    }

    async sendDeploy(provider: ContractProvider, via: Sender, value: bigint) {
        await provider.internal(via, {
            value,
            sendMode: SendMode.PAY_GAS_SEPARATELY,
            body: beginCell().endCell(),
        });
    }

    async getTest(provider: ContractProvider): Promise<number> {
        try {
            const result = await provider.get('test', []);
            return result.stack.readNumber();
        } catch (error) {
            console.error("Error executing test method:", error);
            throw new Error("Unable to execute test method. Ensure the contract is initialized and accessible.");
        }
    }
    async getOwner(provider: ContractProvider) : Promise<Address> {
       
        const result = await provider.get('get_owner', []);
        
        return result.stack.readAddress();
    }
    async getWalletData(provider: ContractProvider): Promise<{ balance: bigint; ownerAddress: Address; jettonMasterAddress: Address; jettonWalletCode: Cell }> {
        const result = await provider.get('get_wallet_data', []);
        const balance = result.stack.readBigNumber();
        const ownerAddress = result.stack.readAddress();
        const jettonMasterAddress = result.stack.readAddress();
        const jettonWalletCode = result.stack.readCell();
        return { balance, ownerAddress, jettonMasterAddress, jettonWalletCode };
    }
    
}
