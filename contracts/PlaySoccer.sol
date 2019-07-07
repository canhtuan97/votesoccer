pragma solidity ^0.4.23;

contract PlaySoccer{
		
	mapping (bytes32 => mapping (address => uint256)) public bets;

	// địa chỉ admin
	address owner;

	// xác định xem thowfii gian đặt cược có hoạt động
	bool bettingActive = false;

	string public tuan = "ahihihi";

	bytes32 winner;
    uint256 numCandidates;
    uint256 numvoters;

    // tất cả candidate sẽ được lưu trong 1 mảng string
    bytes32[] public candidateList;

    // lưu tất cả địa chỉ của của clieint tham gia
    address[] public betters;


    event Print(bytes32[] _name);

    modifier onlyOwner() {
        require(msg.sender == owner);
        _;
    }

    // khởi tạo 
    constructor() public {
        owner = msg.sender;
        numCandidates = 0;
    }

    //get all thông tin của các candidate
    function getCandidateList() public constant returns (bytes32[]) {
        return candidateList;
    }
    // get address của admin sở hữu contract này
    function getOwner() public constant returns (address) {
        return owner;
    }
    // Hàm lấy về số candidate
    function getCount() public constant returns (uint256) {
        return candidateList.length;
    }
    //Returns the total balance involved in bets
    function getBalance() public constant returns (uint256) {
        return address(this).balance;
    }

    // thêm 1 candidate
    function addCandidate(bytes32 candidate) onlyOwner public returns (bool) {
        candidateList.push(candidate);
        numCandidates += 1;
        return true;
    }
    // nhập đội chiến thằng chỉ có thể gọi bởi admiin
    function addWinner(bytes32 selectedwinner) onlyOwner public returns (bool) {
        winner = selectedwinner;
        return true;
    }

    // Bắt đầu cá cược
    function beginVotingPeriod() onlyOwner public returns(bool) {
        bettingActive = true;
        return true;
    }

    //Tăng số vote cho mỗi cadidate
    function betOnCandidate(bytes32 candidate) public payable  {
        require(bettingActive);
        require(msg.value >= 1 ether);
        require(validCandidate(candidate));
        betters.push(msg.sender);
        bets[candidate][msg.sender] += msg.value;
    }

    //Kiểm tra xem candidate có hợp lệ k
    function validCandidate(bytes32 candidate) view public returns (bool) {
        for(uint i = 0; i < candidateList.length; i++) {
            if (candidateList[i] == candidate) {
                return true;
            }
        }
        return false;
    }
    // Triển khai chọn ngẫu nhiên người chiến thắng
    function getWinner() view public returns (uint256) {
        if (numCandidates == 0) return;
        return (uint256(keccak256(abi.encodePacked(blockhash(block.number - 1)))) % numCandidates);
    }

    // Đóng chức năng vote và chia tiền
    function closeVoting() onlyOwner public returns (bool) {
        require(bettingActive);
        bytes32 winningCandidate = candidateList[getWinner()];

        // getting list of winners and losers
        // and the money lost by all losers
        address[] memory winners;
        uint256 numWinners = 0;
        uint256 numLosers = 0;
        uint256 surplus = 0;
        for (uint x = 0; x < betters.length; x++) {
            if (bets[winningCandidate][betters[x]] > 0) {
                winners[numWinners++] = betters[x];
            } else {
                surplus += bets[winningCandidate][betters[x]];
                numLosers++;
            }
        }

        // keeping 10% as service fee and distribute rest among the winners
        uint256 prize = surplus * 9 / 10;
        // calculate prize per winner
        prize = prize / numLosers;
        // distribute the prize to the winners alongwith the money they bet in
        for (x = 0; x < winners.length; x++) {
            winners[x].transfer(prize + bets[winningCandidate][winners[x]]);
        }
        // Close the betting period
        bettingActive = false;
        return true;
    }
}