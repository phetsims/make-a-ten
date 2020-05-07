/* eslint-disable */
import simLauncher from '../../joist/js/simLauncher.js';
const mipmaps = [
  {
    "width": 153,
    "height": 312,
    "url": "data:image/png;base64,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"
  },
  {
    "width": 77,
    "height": 156,
    "url": "data:image/png;base64,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"
  },
  {
    "width": 39,
    "height": 78,
    "url": "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACcAAABOCAYAAACjWA+nAAAAAklEQVR4AewaftIAAATnSURBVMXBD4zVdQEA8M/7vp/IBVeaHoKenGMIKRAcbUxmhrqM3EpZY9xumkJrs9oQK3OFI0Q2rCHQ8k8a/kl0Y7OZmbKAgWnJyrX+WEbm4VDZkTpxyukQTK7bHtvj6+/3fvfe3XvvPp+C5lqGbszAb9AtR6I5bsBinKPsyzgXu1VQ1FjX4Be4Am1io/Ahtqog0RgX4yacj6Cyz8iRqL+fYjFaDW6iHIn6uRDrMFv1ghyJ+liGFThF9fqxQ46C4VuPb+FE1XsTD+B6OQqG515cjaJ87+Jv+Av2YSP6DCIxdHdhCQoqex3bsBp71CgxNDfj6yjIdhCP4kb0GqJE7brxHRSl9eMPuBHPGKZEbcbhFoyR9g5uwwp1kqjNz9EhbT+W4lfqKFG9blwq7U18DdvUWVC972KU2BGswjYNEFTnm5gt7RHcrkGC6ixBQexVXKOBgsFdjk5pd6NPAwWDW4xE7F9Yo8GCfAnOl3avJgjyLUWbWA82aIIg36XStmiSIN8MsbdxiyYJKrsS48V24Q1NElQ2X9rDmiiobLrYy9ikiYJsLZgk9mdNFmTrxsfFdmqyINsFYgexSZMF2aaIvYpDmizI1iG2xwgI0qZigthzRkCQthBB2VE8bAQEadPFXsNuIyBI6xDbZ4QEaWeK7TVCgtgEjBd73ggJYguRKOvHI0ZIIjZd7DW8oDYTcBnOxifQouR9vI1/4FH0GUQiNlnsdYNrxTLMw9k4A4l8d6AHO/FDHJIhEWsX61XZIizBeThJbcaiE53owlrc5iMSsTaxF6UtwjLMQWL4zsRanIHvO06i7AKcLPacsg7cji9glPo6Ed/GAax1TKJsvthRPKHkWnwP7RpnFG7A43jBgETZOWIHMAvLMQ9FQ/M+jigZi6CyU/EjLDAgUTZR7CQ8gdGqcxT70IPd2I3t2Kvsk5iPSzAPk6RdjA68kig7XewEnGBwe7ALD2KnfG9hMzYreRBXirXieixNlEzFeNU7imdxH+4xdF/FDMwUO8+ARMlCBNV5BWtxh/p4GjPFJhqQKJmpOjuwGL3qZwuuFRuHaYmSSfL14yFcpf7+KNucoKRdvgdwlcbow0FpUwIuwmkq24IlGmu0DAELVLYX3RprIkZJ6wuYI1s/bkWfxvq8bP8MOFe2l3CnxuuU9gF2BYyRbb/mmCVtP94K+LtsYzVeC6ZJ6zEgYDnek3a6xluJk6U9bUDAdjwpbTwWapwEXdIOYJ0BQclGfCitS+PcibOkPYlDBgQlj+NFaZ9Di/pbhCukvYf1jgnK/iptHFarrxlYh49J+y3+5JigbKtsXWhVH63YhHZpb+AHjhOUPYT/SmvHTwxfK3ZglrR+3IU9jhPEdsnWhcsN3WQ8hTmy/R4rfUQQuwdHpI3BGrSo3RexDbNl68U3ZCiKvYRL0CGtDZ/GZtVbiVsxQbZ3cR1+J0NRWh8WoChtKs7CY/JdiPtxNVpkO4zV+JkKitL+jc9ismwz0YktOCI2FxuwElNQkO0DbMBNchRkm43tOEVlL2Mr3kEbZmIaRst3GOux3CAKKluFFSion4NYgx+rQlFlT2EuJquPvViKjapUlO8xfAmnGbr/YSu+gmfVoCjfETyDi3Cq2vVgFa5DnxoVVOdTuA9zVec/+CVWGIaC2tyMyzAFLcoOoxfP49e4Xx38H5Q29n8VTQJMAAAAAElFTkSuQmCC"
  },
  {
    "width": 20,
    "height": 39,
    "url": "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABQAAAAnCAYAAAAPZ2gOAAAAAklEQVR4AewaftIAAAJvSURBVKXBQWiVdQAA8N/3/76NjbRAULMZ1Yw8PMPDBA+KGYVlB5F6IUQLSVAqCLU2CEF2Kjt0CSWpPOihwAqCJA9CTrIokWVgg0IZNsKRNyHH5vL14D/4/N57be+9/X6p1m3CYXyEXnzjLpnmrcIhbMU9os1qZJqzFwN4QNFyNTLzO4Z+dCi6jdNqJOZ2EmUkomlcxGkM47wamf93BGUkqGAE7+MLc8g09gpeRYIpfIw3NSHT2AC6cAcfYlCTgnqDKIm+x6AWBPV2IMEtDGlRULQRa0RnMaxFQVE/OjGDo9oQFK0T/YZT2hDkMqwSDWtTkHsZ92EGn2lTkNsguo4L2hTkVouuWYAgt1L0uwUIosVYIfrFAmSiMrowhZMaW491WIR/8CNG1MhEfaK/cUPuNZRRwjIkcv9iDJ/joFmZ6BHRddFO7MPjSDSW4lEcQA92qUpF72AZLmE73kIPEvWmUUEQJViDP/FrJlohegaZonGM4AK+w0/oxovYiSfRgV04nuEpLBFlcldwFB+oN4kTOIGr6EVJVYYtSOQq+BYv4ab5jaEXS7A+Q0nRKWzTvFtypYDVcldQ1prFchMBD8mdwbTW9IgmcTZgVK5ba57Fw6IxTAYcQUW0VmsG0CE6pyrgE4yLSnhOc4bwhOgG3lMVRJdFnRgwvzfwNlJUcBzjqlJRJ7YhwYOYwg8aO4AhLBL9jB1mpaJLeB73I6APVzEq14tj2IMu0TX0Y8KsVG4GW5GiG09jKR7DfryLPgTRX9iN8+6SKPoSL5jfKF7HOTVSRV9jC1ZqbBJfYTv+0ECi3lJ8is24F3cwgYs4jDPm8B9tbH7lgzQsFQAAAABJRU5ErkJggg=="
  },
  {
    "width": 10,
    "height": 20,
    "url": "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAoAAAAUCAYAAAC07qxWAAAAAklEQVR4AewaftIAAAEGSURBVH3BMShEAQAA0Hf/fllYruu2Y3BRRiYGg7pNXRanTpdFNhmNDLIbiDK4iEVdKbHJpEwuVrJgIwmRcvWvzrnjvZjWJjGLBDKqQs22kEcbHtSEGu1jDFfYwa6aUN08cthG0S+BuilcoKiFQGQcGaz7QyAyilts+EMg0oeKfwQiaVT8I8QAEjhSN4wkznCnKkQWT/hAGUNIIoZXlFGIYwY9KKAfz7jAFb4wgucQ3UjgEYtY0Oge2RBdeMMcSpq9oz1AB65R0qwHKdwHOEUnejVbRoi9AIdox5JGq8jhGOU4zpHHIFJIYwVjuMQEXmIiBayhQ+QLJ5jGjaqYuiLy+MQBNv3wDWYcNvVryuHnAAAAAElFTkSuQmCC"
  }
];
mipmaps.forEach( mipmap => {
  mipmap.img = new Image();
  const unlock = simLauncher.createLock( mipmap.img );
  mipmap.img.onload = unlock;
  mipmap.img.src = mipmap.url; // trigger the loading of the image for its level
  mipmap.canvas = document.createElement( 'canvas' );
  mipmap.canvas.width = mipmap.width;
  mipmap.canvas.height = mipmap.height;
  const context = mipmap.canvas.getContext( '2d' );
  mipmap.updateCanvas = () => {
    if ( mipmap.img.complete && ( typeof mipmap.img.naturalWidth === 'undefined' || mipmap.img.naturalWidth > 0 ) ) {
      context.drawImage( mipmap.img, 0, 0 );
      delete mipmap.updateCanvas;
    }
  };
} );
export default mipmaps;