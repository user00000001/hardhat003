import { task } from "hardhat/config"
import { HardhatRuntimeEnvironment, TaskArguments } from "hardhat/types"
import { SignerWithAddress } from "@nomiclabs/hardhat-ethers/signers"
import { RandomNumberConsumerV2Plus, RandomNumberConsumerV2Plus__factory } from "../../typechain-types"
import { ContractTransaction } from "ethers"

task("request-random-number", "Requests a random number for a Chainlink VRF enabled smart contract")
    .addParam("contract", "The address of the API Consumer contract that you want to call")
    .setAction(async (taskArgs: TaskArguments, hre: HardhatRuntimeEnvironment): Promise<void> => {
        const contractAddr: string = taskArgs.contract
        const networkId: string = hre.network.name

        console.log(
            `Requesting a random number using VRF consumer contract ${contractAddr} on network ${networkId}`
        )

        //Get signer information
        const accounts: SignerWithAddress[] = await hre.ethers.getSigners()
        const signer: SignerWithAddress = accounts[0]

        //Create connection to VRF Contract and call the getRandomNumber function
        const vrfConsumerContractV2Plus: RandomNumberConsumerV2Plus =
            RandomNumberConsumerV2Plus__factory.connect(contractAddr, signer)

        const tx: ContractTransaction = await vrfConsumerContractV2Plus.requestRandomWords()

        console.log(
            `Contract ${contractAddr} random number request successfully called. Transaction Hash: ${tx.hash}\n`,
            `Run the following to read the returned random number:\n`,
            `yarn hardhat read-random-number --contract ${contractAddr} --network ${hre.network.name}`
        )
    })
