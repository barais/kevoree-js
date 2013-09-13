var list = [];
list.push({ toString: 'AddDeployUnit' });
list.push({ toString: 'AddInstance' });
list.push({ toString: 'RemoveDeployUnit' });
list.push({ toString: 'AddInstance' });
list.push({ toString: 'RemoveDeployUnit' });
list.push({ toString: 'AddInstance' });
list.push({ toString: 'StopInstance' });
list.push({ toString: 'AddInstance' });
list.push({ toString: 'StopInstance' });

// messed up array
console.log(list);
console.log("\n\n");

// sort array in order to have :
// stopInstance > removeInstance > removeDeployUnit > addDeployUnit > addInstance > startInstance
var CommandRank = {
	"StopInstance": 	0,
	"RemoveInstance": 	1,
	"RemoveDeployUnit": 2,
	"AddDeployUnit": 	3,
	"AddInstance": 		4,
	"StartInstance": 	5
};

list.sort(function (a, b) {
	if (CommandRank[a.toString] > CommandRank[b.toString]) return 1;
	else if (CommandRank[a.toString] < CommandRank[b.toString]) return -1;
	else return 0;
});

console.log(list);