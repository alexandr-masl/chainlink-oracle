// SPDX-License-Identifier: MIT
pragma solidity 0.8.19;

import {Chainlink, ChainlinkClient} from "@chainlink/contracts/src/v0.8/ChainlinkClient.sol";
import {ConfirmedOwner} from "@chainlink/contracts/src/v0.8/shared/access/ConfirmedOwner.sol";
import {LinkTokenInterface} from "@chainlink/contracts/src/v0.8/shared/interfaces/LinkTokenInterface.sol";

/**
 * THIS IS AN EXAMPLE CONTRACT THAT USES UN-AUDITED CODE.
 * DO NOT USE THIS CODE IN PRODUCTION.
*/

contract HighLevelOracle is ChainlinkClient, ConfirmedOwner {
    using Chainlink for Chainlink.Request;

    uint256 private constant ORACLE_PAYMENT = (1 * LINK_DIVISIBILITY) / 10; // 0.1 * 10**18
    uint256 public currentETHPrice;
    address oracle;
    mapping(uint => string) requestTypeToJobID;

    event RequestEthereumPriceFulfilled(
        bytes32 indexed requestId,
        uint256 indexed price,
        string indexed coin
    );

    event EthereumPriceRequested(
        bytes32 indexed requestId,
        string indexed coin
    );

    modifier chargeFee() {
        LinkTokenInterface oracleToken = LinkTokenInterface(_chainlinkTokenAddress());
        require(
            oracleToken.transferFrom(msg.sender, address(this), ORACLE_PAYMENT),
            "Unable to transfer fee"
        );
        _;
    }


    /**
     *  Sepolia
     *@dev LINK address in Sepolia network: 0x779877A7B0D9E8603169DdbD7836e478b4624789
     * @dev Check https://docs.chain.link/docs/link-token-contracts/ for LINK address for the right network
     */
    constructor(address _oracleToken, address _oracle) ConfirmedOwner(msg.sender) {
        _setChainlinkToken(_oracleToken);
        oracle = _oracle;
    }

    function setJobIDToRequestType(string memory _jobId, uint _requestType) external onlyOwner{
        require(bytes(_jobId).length > 0, "Job ID cannot be empty");
        requestTypeToJobID[_requestType] = _jobId;
    }

    function requestCryptocompareETHPrice() public chargeFee {

        uint requestType = 1;
        string memory jobId = requestTypeToJobID[requestType];
        require(bytes(jobId).length > 0, "Job ID not set for requestType");

        Chainlink.Request memory req = _buildChainlinkRequest(
            stringToBytes32(requestTypeToJobID[requestType]),
            address(this),
            this.fulfillCryptocompareCoinPrice.selector
        );
        req._add("coin", "ETH");
        req._add("path", "USD");
        req._addInt("times", 100);

        bytes32 requestID = _sendChainlinkRequestTo(oracle, req, ORACLE_PAYMENT);

        emit EthereumPriceRequested(requestID, "ETH");
    }

    function fulfillCryptocompareETHPrice(
        bytes32 _requestId,
        uint256 _price,
        string memory _coin
    ) public recordChainlinkFulfillment(_requestId) {
        emit RequestEthereumPriceFulfilled(_requestId, _price, _coin);
        currentETHPrice = _price;
    }

    function requestCryptocompareCoinPrice(string calldata _coin) public chargeFee {

        uint requestType = 1;
        string memory jobId = requestTypeToJobID[requestType];
        require(bytes(jobId).length > 0, "Job ID not set for requestType");

        Chainlink.Request memory req = _buildChainlinkRequest(
            stringToBytes32(requestTypeToJobID[requestType]),
            address(this),
            this.fulfillCryptocompareCoinPrice.selector
        );
        req._add("coin", _coin);
        req._add("path", "USD");
        req._addInt("times", 100);

        bytes32 requestID = _sendChainlinkRequestTo(oracle, req, ORACLE_PAYMENT);

        emit EthereumPriceRequested(requestID, _coin);
    }

    function fulfillCryptocompareCoinPrice(
        bytes32 _requestId,
        uint256 _price,
        string memory _coin
    ) public recordChainlinkFulfillment(_requestId) {
        emit RequestEthereumPriceFulfilled(_requestId, _price, _coin);
        currentETHPrice = _price;
    }





    function getChainlinkToken() public view returns (address) {
        return _chainlinkTokenAddress();
    }

    function withdrawLink() public onlyOwner {
        LinkTokenInterface link = LinkTokenInterface(_chainlinkTokenAddress());
        require(
            link.transfer(msg.sender, link.balanceOf(address(this))),
            "Unable to transfer"
        );
    }

    function cancelRequest(
        bytes32 _requestId,
        uint256 _payment,
        bytes4 _callbackFunctionId,
        uint256 _expiration
    ) public onlyOwner {
        _cancelChainlinkRequest(
            _requestId,
            _payment,
            _callbackFunctionId,
            _expiration
        );
    }

    function stringToBytes32(
        string memory source
    ) private pure returns (bytes32 result) {
        bytes memory tempEmptyStringTest = bytes(source);
        if (tempEmptyStringTest.length == 0) {
            return 0x0;
        }

        assembly {
            // solhint-disable-line no-inline-assembly
            result := mload(add(source, 32))
        }
    }
}
