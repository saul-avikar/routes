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

	const moveTowards = () => {

	}

	const followRoute = (name, delta) => {
		if (!camera) {
			throw new Error("'camera' is not set");
		}

		if (!name) {
			throw new Error("'name' is not set");
		}

		const point = routes[name].points[currentPoint];
		//camera.position.set((camera.position.x + point.x) * delta / 1000, point.y, point.z);
		camera.position.lerp(point, delta * 1)
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
