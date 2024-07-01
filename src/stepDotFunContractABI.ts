export const STEP_DOT_FUN_CONTRACT_ABI = [
  { type: 'constructor', inputs: [], stateMutability: 'nonpayable' },
  {
    type: 'function',
    name: 'claimPrize',
    inputs: [
      {
        name: 'competitionId',
        type: 'uint256',
        internalType: 'uint256',
      },
      {
        name: 'winnerAddress',
        type: 'address',
        internalType: 'address',
      },
    ],
    outputs: [],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    name: 'competitionCount',
    inputs: [],
    outputs: [{ name: '', type: 'uint256', internalType: 'uint256' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    name: 'competitions',
    inputs: [{ name: '', type: 'uint256', internalType: 'uint256' }],
    outputs: [
      { name: 'name', type: 'string', internalType: 'string' },
      {
        name: 'bannerImageUrl',
        type: 'string',
        internalType: 'string',
      },
      { name: 'startTime', type: 'uint256', internalType: 'uint256' },
      { name: 'endTime', type: 'uint256', internalType: 'uint256' },
      { name: 'entryFeeUSD', type: 'uint256', internalType: 'uint256' },
      { name: 'totalBalance', type: 'uint256', internalType: 'uint256' },
    ],
    stateMutability: 'view',
  },
  {
    type: 'function',
    name: 'createCompetition',
    inputs: [
      {
        name: 'competitionId',
        type: 'uint256',
        internalType: 'uint256',
      },
      { name: 'name', type: 'string', internalType: 'string' },
      {
        name: 'bannerImageUrl',
        type: 'string',
        internalType: 'string',
      },
      { name: 'startTime', type: 'uint256', internalType: 'uint256' },
      { name: 'endTime', type: 'uint256', internalType: 'uint256' },
      { name: 'entryFeeUSD', type: 'uint256', internalType: 'uint256' },
    ],
    outputs: [],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    name: 'getCompetition',
    inputs: [
      {
        name: 'competitionId',
        type: 'uint256',
        internalType: 'uint256',
      },
    ],
    outputs: [
      {
        name: '',
        type: 'tuple',
        internalType: 'struct Competition',
        components: [
          { name: 'name', type: 'string', internalType: 'string' },
          {
            name: 'bannerImageUrl',
            type: 'string',
            internalType: 'string',
          },
          {
            name: 'playerAddresses',
            type: 'address[]',
            internalType: 'address[]',
          },
          {
            name: 'startTime',
            type: 'uint256',
            internalType: 'uint256',
          },
          { name: 'endTime', type: 'uint256', internalType: 'uint256' },
          {
            name: 'entryFeeUSD',
            type: 'uint256',
            internalType: 'uint256',
          },
          {
            name: 'totalBalance',
            type: 'uint256',
            internalType: 'uint256',
          },
        ],
      },
      { name: '', type: 'address[]', internalType: 'address[]' },
    ],
    stateMutability: 'view',
  },
  {
    type: 'function',
    name: 'getCompetitions',
    inputs: [],
    outputs: [
      {
        name: '',
        type: 'tuple[]',
        internalType: 'struct Competition[]',
        components: [
          { name: 'name', type: 'string', internalType: 'string' },
          {
            name: 'bannerImageUrl',
            type: 'string',
            internalType: 'string',
          },
          {
            name: 'playerAddresses',
            type: 'address[]',
            internalType: 'address[]',
          },
          {
            name: 'startTime',
            type: 'uint256',
            internalType: 'uint256',
          },
          { name: 'endTime', type: 'uint256', internalType: 'uint256' },
          {
            name: 'entryFeeUSD',
            type: 'uint256',
            internalType: 'uint256',
          },
          {
            name: 'totalBalance',
            type: 'uint256',
            internalType: 'uint256',
          },
        ],
      },
    ],
    stateMutability: 'view',
  },
  {
    type: 'function',
    name: 'hasJoined',
    inputs: [
      { name: '', type: 'uint256', internalType: 'uint256' },
      { name: '', type: 'address', internalType: 'address' },
    ],
    outputs: [{ name: '', type: 'bool', internalType: 'bool' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    name: 'joinCompetition',
    inputs: [
      {
        name: 'competitionId',
        type: 'uint256',
        internalType: 'uint256',
      },
      { name: 'playerName', type: 'string', internalType: 'string' },
    ],
    outputs: [],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    name: 'owner',
    inputs: [],
    outputs: [{ name: '', type: 'address', internalType: 'address' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    name: 'usdcToken',
    inputs: [],
    outputs: [{ name: '', type: 'address', internalType: 'contract IERC20' }],
    stateMutability: 'view',
  },
  {
    type: 'event',
    name: 'CompetitionCreated',
    inputs: [
      {
        name: 'competitionId',
        type: 'uint256',
        indexed: true,
        internalType: 'uint256',
      },
      {
        name: 'startTime',
        type: 'uint256',
        indexed: false,
        internalType: 'uint256',
      },
      {
        name: 'endTime',
        type: 'uint256',
        indexed: false,
        internalType: 'uint256',
      },
      {
        name: 'entryFeeUSD',
        type: 'uint256',
        indexed: false,
        internalType: 'uint256',
      },
    ],
    anonymous: false,
  },
  {
    type: 'event',
    name: 'PlayerJoined',
    inputs: [
      {
        name: 'competitionId',
        type: 'uint256',
        indexed: true,
        internalType: 'uint256',
      },
      {
        name: 'playerAddress',
        type: 'address',
        indexed: true,
        internalType: 'address',
      },
      {
        name: 'playerName',
        type: 'string',
        indexed: false,
        internalType: 'string',
      },
    ],
    anonymous: false,
  },
  {
    type: 'event',
    name: 'PrizeClaimed',
    inputs: [
      {
        name: 'competitionId',
        type: 'uint256',
        indexed: true,
        internalType: 'uint256',
      },
      {
        name: 'winnerAddress',
        type: 'address',
        indexed: true,
        internalType: 'address',
      },
      {
        name: 'prizeAmount',
        type: 'uint256',
        indexed: false,
        internalType: 'uint256',
      },
    ],
    anonymous: false,
  },
  { type: 'error', name: 'AlreadyJoined', inputs: [] },
  { type: 'error', name: 'CompetitionNotActive', inputs: [] },
  { type: 'error', name: 'InvalidCompetition', inputs: [] },
  { type: 'error', name: 'OnlyOwner', inputs: [] },
] as const;
