/**
 * © 2022 WavePlay <dev@waveplay.com>
 */

let id = 0;
export const generateNumber = () => id++;

/**
 * Smol utility function meant to help us wait for a window event to fire.
 * This is super useful for waiting for window reload and back events!
 */
export const eventWaiter = async (event: string): Promise<any> => {
	return new Promise<any>((resolve) => {
		const callback = () => resolve(callback);
		window.addEventListener(event, callback);
	});
};
