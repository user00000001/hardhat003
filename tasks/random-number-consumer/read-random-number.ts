import { task } from "hardhat/config"
import { HardhatRuntimeEnvironment, TaskArguments } from "hardhat/types"
import { SignerWithAddress } from "@nomiclabs/hardhat-ethers/signers"
import { RandomNumberConsumerV2Plus, RandomNumberConsumerV2Plus__factory } from "../../typechain-types"
import { BigNumber } from "ethers"

task("read-random-number", "Reads the random number returned to a contract by Chainlink VRF")
    .addParam("contract", "The address of the VRF contract that you want to read")
    .setAction(async (taskArgs: TaskArguments, hre: HardhatRuntimeEnvironment): Promise<void> => {
        const contractAddr: string = taskArgs.contract
        const networkId: string = hre.network.name

        console.log(`Reading data from VRF contract ${contractAddr} on network ${networkId}`)

        //Get signer information
        const accounts: SignerWithAddress[] = await hre.ethers.getSigners()
        const signer: SignerWithAddress = accounts[0]

        const vrfConsumerContractV2Plus: RandomNumberConsumerV2Plus =
            RandomNumberConsumerV2Plus__factory.connect(contractAddr, signer)

        try {
            const firstRandomNumber: BigNumber = await vrfConsumerContractV2Plus.s_randomWords(0)
            const secondRandomNumber: BigNumber = await vrfConsumerContractV2Plus.s_randomWords(1)
            console.log(
                `Random Numbers are: ${firstRandomNumber.toString()} and ${secondRandomNumber.toString()}`
            )
        } catch (error) {
            console.error(error)
            if (["hardhat", "localhost", "ganache"].includes(hre.network.name)) {
                console.log(
                    "You'll have to manually update the value since you're on a local chain!"
                )
            } else {
                console.log(
                    `Visit https://vrf.chain.link/sepolia/${process.env.VRF_SUBSCRIPTION_ID} and make sure that your last request fulfillment is there`
                )
            }
        }
    })
