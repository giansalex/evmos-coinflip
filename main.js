const contractId = '0x94e98Fb33BE632DB652c4C9f771e4FDc724bc22B';

const web3 = new Web3(window.web3.currentProvider);

let playerAddress;
let contractInstance;

$(document).ready(() => {
	window.ethereum.enable().then((accounts) => {

		console.log(accounts);
		playerAddress = accounts[0];
		contractInstance = new web3.eth.Contract(abi, contractId, {from: playerAddress});
		displayDappBalance();
		displayPlayerBalance();
		$('#wager_button').click(inputData);
	});
});

function displayDappBalance() {
	contractInstance.methods.getDappBalance().call().then((res) => {
		$('#dapp_balance_output').text(web3.utils.fromWei(res, "ether"));
	});
}

function displayPlayerBalance() {
	web3.eth.getBalance(playerAddress).then((res) => {
		$('#player_balance_output').text(web3.utils.fromWei(res, "ether"))
	});
}

function deposit() {
	let config = {
		value: web3.utils.toWei($('#wager_input').val(), 'ether')
	};

	contractInstance.methods.deposit().send(config, function (err, res) {
		if (err) {
		  console.log("An error occured", err)
		  return
		}
		console.log("Hash of the transaction: " + res)
	  })
	.on('transactionHash', (hash) => {
		console.log('1: ', hash);
	})
	.on('confirmation', (confirmationNr) => {
		console.log('2: ', confirmationNr);
	})
	.on('receipt', (receipt) => {
		alert('completed');
	});
}

function setOwner(owner) {
	let config = {
	};

	contractInstance.methods.changeOwner(owner).send(config, function (err, res) {
		if (err) {
		  console.log("An error occured", err)
		  return
		}
		console.log("Hash of the transaction: " + res)
	  })
	.on('transactionHash', (hash) => {
		console.log('1: ', hash);
	})
	.on('confirmation', (confirmationNr) => {
		console.log('2: ', confirmationNr);
	})
	.on('receipt', (receipt) => {
		alert('completed');
	});
}


function inputData() {
	let config = {
		value: web3.utils.toWei($('#wager_input').val(), 'ether')
	};
	let flipValue = $('#inlineFormCustomSelect').val() === 'Heads' ? true : false;

	contractInstance.methods.flip(flipValue).send(config, function (err, res) {
		if (err) {
		  console.log("An error occured", err)
		  return
		}
		console.log("Hash of the transaction: " + res)
	  })
	.on('transactionHash', (hash) => {
		console.log('1: ', hash);
	})
	.on('confirmation', (confirmationNr) => {
		console.log('2: ', confirmationNr);
	})
	.on('receipt', (receipt) => {
		let result = receipt.events.flipResult.returnValues.value === '1' ? 'Heads' : 'Tails';
		let waitingPeriod;
		let n = 4;

		waitingPeriod = setInterval(() => {
			$('#result').text(n-=1);
		}, 1000);

		setTimeout(() => {
			if (receipt.events.flipResult.returnValues.result === true) {
				$('#result').text(result + '... You Won!')
			} else {
				$('#result').text(result + '... You Lost!')
			}
			clearInterval(waitingPeriod);
			displayDappBalance();
			displayPlayerBalance();
		}, 4000);
	});
}
