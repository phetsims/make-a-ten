/* eslint-disable */
import SimLauncher from '../../joist/js/SimLauncher.js';
const image = new Image();
const unlock = SimLauncher.createLock( image );
image.onload = unlock;
image.src = 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAEQAAAA3CAYAAAC1pezdAAAACXBIWXMAABcSAAAXEgFnn9JSAAAAGXRFWHRTb2Z0d2FyZQBBZG9iZSBJbWFnZVJlYWR5ccllPAAAAnNJREFUeNrsm4ttwjAQhk3FANmAbEA6QekG3aDuBh0hG9AN3A0QEwATwAbtBmEDaldOFdDZ8TO+UznpBFIckvt899smDmN3u7LZyPFG+qv+VF4huOe99JP0rf4+Zlz6k753dc5nyEVr6TvpF+S+HolDAOccfTtWEe0IwLjoTvOB4Q2FEwFx0Z3WBMBwhtL8IxhOUI6Wi7fSVwgEtdH3UQeWijMUbmlcExw9o6FsDJlREQGwBkpIxAg01IATy4YuAZRVP+eADlIsjVgoSit/qUA1RVUnYqBwE5AdcdEMgfKnmdSAQIFtgNm1D5SrtpSAQAGJkZGy8dUdKkBsMERg+YAzXgpAQmHYoKxN03/sQGJhuKx/yABJBcMLClYgqWGQBlIMBkYgRWFgA1IcBiYgKGBgAYIGBgYgqGCUBoIORkkgpoCrkjBKAQkNODuMEkBQw5gaiDAEgwbGlEBsD54FFhhTAXF5Ci8wwJgCyDtzf6YqSsN4mGB4vQ1cbXZ5ln4G2r6x8Q0tZ33+CTjGdQcEP3GcF1izbA0whlD64HxgiJtzPrBmyK0tdJn2DtkhEkaFWUPaET2A0t5HM6D2LWYN8TE+WMu4ZIaympqo5oSR3OYIQOwGpVsUBhYgK08BzWrYNKQoDBuQmhCMReqSORmAVCMTKFdTM8+9Y9tv7T4GDcfR2dWlHMsn1h9obhO9zhG5fjjzGukLuOevnKRV5rwghNEw80bjqMwevh6ysQTv8zpGbhBLZt4yqvTnMZH2GVOQkjc5eqAjCoPnSsvaUp9Y34xYTVGvLYFsESzxfvyZQ5v+j5wlw/EywEGL/D6VeN7NYj8CDABGFHbeFw27mAAAAABJRU5ErkJggg==';
export default image;