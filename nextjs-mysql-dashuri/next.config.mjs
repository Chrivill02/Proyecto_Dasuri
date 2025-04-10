/** @type {import('next').NextConfig} */
const nextConfig = {
	async redirects(){
		return[
			{
				source: '/', destination: '/inventario',permanent: true,
			}
		]
	}
};

export default nextConfig;

