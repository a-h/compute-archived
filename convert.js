const fs = require('fs');

const convert = (input) => input.map(item => {
		return {
			id: item.id,
			q: item.q,
			ec2: {
				true: item["ec2.true"],
				false: item["ec2.false"],
				rationale: item["ec2.rationale"],
			},
			containers: {
				true: item["containers.true"],
				false: item["containers.false"],
				rationale: item["containers.rationale"],
			},
			lambda: {
				true: item["lambda.true"],
				false: item["lambda.false"],
				rationale: item["lambda.rationale"],
			},
		}
	});

const data = JSON.parse(fs.readFileSync('/dev/stdin').toString());
const output = convert(data);
console.log(JSON.stringify(output, null, 2))

