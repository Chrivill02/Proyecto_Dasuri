import proveedorform from "@/components/ProveedorForm.jsx";
import mostrartablas from "@/components/MostrarTablas";
import comprarAproveedor from "@/components/ComprarAProveedor";
import botonMostrarCompras from "@/components/Boton_MostrarCompras";
import botonMostrarProveedor from "@/components/Boton_MostrarProveedor";
import comprasform from "@/components/Compras";
import Link from 'next/link';

const Forms = proveedorform
const Form2 = mostrartablas
const Form3 = comprarAproveedor
const Form4 = comprasform
const Boton1 = botonMostrarCompras
const Boton2 = botonMostrarProveedor


function compraproveedor() {
	
	return (
		
		<div style={{
			display: 'flex',
			width: '100vw',	//100% ancho pantalla
			height: '100vh',	//100% alto pantalla
			border: '2px #CCA9DD',
			padding: '20px',
			backgroundColor: '#CCA9DD',
		}}
		> 

		
			<Forms />
			<div className="flex items-center space-x-4">
                <Link href="/">
                    <button className="inline-flex items-center px-3 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500">
                         ← Inicio
                     </button>
                </Link>
                <h1 className="text-2xl font-bold text-blue">Registro de reservas</h1>
            </div>
			<Form2 />
			<Form3 />
			<Form4 />
			<Boton1 />
			<Boton2 />
		</div>
	);
}

export default compraproveedor;