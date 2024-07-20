// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

interface IOwnable {
  function owner() external returns (address);

  function transferOwnership(address recipient) external;

  function acceptOwnership() external;
}
