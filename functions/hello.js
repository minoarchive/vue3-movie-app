exports.handler = async function (event, context) {
	return {
		statusCode: 200,
		body: JSON.stringify({
			name: 'Mino',
			age: 30,
			email: 'minho00123@gmail.com',
		}),
	};
};
