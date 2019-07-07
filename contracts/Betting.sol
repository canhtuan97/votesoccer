pragma solidity ^0.4.23;

contract Betting{
    address public owner;
    uint256 public mininumBet;
    uint256 public totalBetOne;
    uint256 public totalBetTwo;
    address[] public players;

    struct player {
        uint256 amountBet;
        uint8 teamSelect;

    }

    struct game{
        uint game_id;
        string  TeamA;
        string  TeamB;
        bool status;

    }

    // function () public payable{}
    uint public  count_game = 0;

    mapping (address => player) public playerInfor;
    mapping (uint => game) public games;

    constructor() public {
        owner = msg.sender;
        mininumBet = 100000000000000;
    }


     

    function getAdmin() public view returns(address){

            return owner;
    }

    function getCountGame() constant returns(uint count){
        return count_game;
    }
    function addGame(string memory _TeamA, string memory _TeamB) public{
        count_game ++;

        games[count_game] = game(count_game,_TeamA,_TeamB,false);
        
    }

    function getGame() public view returns(string,string){
        return (games[count_game].TeamA,games[count_game].TeamB);
    }

  
    // return 
    function checkPlayerExist(address player) public constant returns(bool) {
        for (uint i=0; i< players.length; i++){
            if (players[i] == player){
                return true;
            }

        }
        return false;

    }


    function bet(uint8 _teamSelect,address _address,uint256 _value) public payable {

        
        require(_value >= mininumBet);

        playerInfor[_address].amountBet = _value;
        playerInfor[_address].teamSelect = _teamSelect;
        players.push(_address);


        if (_teamSelect ==1){
            totalBetOne += _value;
        }
        else {
            totalBetTwo += _value;
        }


    }


    function distributePrizes(uint8 teamWinner) public  {
        address[1000] memory winners;
        uint256 count = 0;
        uint256 loseBet = 0;
        uint256 winBet = 0;

        for (uint i =0; i< players.length; i++){
            if (playerInfor[players[i]].teamSelect == teamWinner ){

                winners[count]= players[i];
                count ++;
            }

        }


        if (teamWinner == 1){
            loseBet = totalBetTwo;
            winBet = totalBetOne;
        }
        else {
            loseBet = totalBetOne;
            winBet = totalBetTwo;

        }

        for (uint j=0; j<= count; j++){
            if (winners[j] != address(0)){
                uint256 bet = playerInfor[winners[j]].amountBet;
                address(uint160(winners[j])).transfer((bet*(10000+(loseBet*10000/winBet)))/10000);
            }
        }

        for (uint k=0; k<players.length; k++){
            delete playerInfor[players[k]];
        }

        players.length =0;
        loseBet =0;
        winBet =0; 
        totalBetOne = 0;
        totalBetTwo = 0;

    }



}
