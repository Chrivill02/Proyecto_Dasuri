/** @type {import('next').NextConfig} */
const nextConfig = {
	async redirects(){
		return[
			{
				source: '/', destination: '/viewInventario',permanent: true,
			}
		]
	}
};

export default nextConfig;

