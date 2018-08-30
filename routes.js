const Routes = function () {
	const routes = {};
	let currentPoint = 1;
	let camera = null;

	const addToRoute = ({ name, point, rotation = new THREE.Vector3(0, 0, 0) }) => {
		if (!point) {
			throw new Error("'point' is not set");
		}

		if (!name) {
			throw new Error("'name' is not set");
		}

		if (!routes[name]) {
			routes[name] = { points: [], rotations: [] };
		}

		routes[name].points = [...routes[name].points, point];
		routes[name].rotations = [...routes[name].rotations, rotation];
	};

	const moveTowards = ({object, target, speed = 1}) => {
		const targetNormalizedVector = new THREE.Vector3(0,0,0);
		const accuracy = speed;

		targetNormalizedVector.x = target.x - object.position.x;
		targetNormalizedVector.y = target.y - object.position.y;
		targetNormalizedVector.z = target.z - object.position.z;
		targetNormalizedVector.normalize();

		object.position.x += targetNormalizedVector.x * speed;
		object.position.y += targetNormalizedVector.y * speed;
		object.position.z += targetNormalizedVector.z * speed;

		if (
			object.position.x >= target.x - accuracy &&
			object.position.x <= target.x + accuracy &&
			object.position.y >= target.y - accuracy &&
			object.position.y <= target.y + accuracy &&
			object.position.z >= target.z - accuracy &&
			object.position.z <= target.z + accuracy
		) {
			return true;
		}

		return false;
	};

	const rotateTowards = ({object, target, speed = 1}) => {
		const accuracy = speed;

		if (
			object.rotation.x >= target.x - accuracy &&
			object.rotation.x <= target.x + accuracy &&
			object.rotation.y >= target.y - accuracy &&
			object.rotation.y <= target.y + accuracy &&
			object.rotation.z >= target.z - accuracy &&
			object.rotation.z <= target.z + accuracy
		) {
			return;
		}

		const targetNormalizedVector = new THREE.Vector3(0,0,0);

		targetNormalizedVector.x = target.x - object.rotation.x;
		targetNormalizedVector.y = target.y - object.rotation.y;
		targetNormalizedVector.z = target.z - object.rotation.z;
		targetNormalizedVector.normalize();

		object.rotation.x += targetNormalizedVector.x * speed;
		object.rotation.y += targetNormalizedVector.y * speed;
		object.rotation.z += targetNormalizedVector.z * speed;
	};

	const followRoute = (name, delta) => {
		if (!camera) {
			throw new Error("'camera' is not set");
		}

		if (!name) {
			throw new Error("'name' is not set");
		}

		const point = routes[name].points[currentPoint];
		const rotation = routes[name].rotations[currentPoint];

		const thereYet = moveTowards({object: camera, target: point, speed: 20 * delta});
		const rotatedYet = rotateTowards({object: camera, target: rotation, speed: 1 * delta});

		if (thereYet) {
			currentPoint++;
		}
	};

	const setCamera = (newCamera) => {
		camera = newCamera;
	}

	return {
		addToRoute,
		followRoute,
		setCamera
	};
};
