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

	const modifyPropertyOverTime = property => {
		return ({object, target, speed = 1}) => {
			if (
				object[property].x >= target.x - speed &&
				object[property].x <= target.x + speed &&
				object[property].y >= target.y - speed &&
				object[property].y <= target.y + speed &&
				object[property].z >= target.z - speed &&
				object[property].z <= target.z + speed
			) {
				return true;
			}

			const targetNormalizedVector = new THREE.Vector3(0,0,0);

			targetNormalizedVector.x = target.x - object[property].x;
			targetNormalizedVector.y = target.y - object[property].y;
			targetNormalizedVector.z = target.z - object[property].z;
			targetNormalizedVector.normalize();

			object[property].x += targetNormalizedVector.x * speed;
			object[property].y += targetNormalizedVector.y * speed;
			object[property].z += targetNormalizedVector.z * speed;

			return false;
		};
	}

	const moveTowards = modifyPropertyOverTime("position");

	const rotateTowards = modifyPropertyOverTime("rotation");

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
