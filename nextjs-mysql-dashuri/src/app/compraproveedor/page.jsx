import proveedorform from "@/components/ProveedorForm.jsx";
import mostrartablas from "@/components/MostrarTablas";
import comprarAproveedor from "@/components/ComprarAProveedor";
import botonMostrarCompras from "@/components/Boton_MostrarCompras";
import botonMostrarProveedor from "@/components/Boton_MostrarProveedor";
import comprasform from "@/components/Compras";

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
		}}> 
			<Forms />
			<Form2 />
			<Form3 />
			<Form4 />
			<Boton1 />
			<Boton2 />
		</div>
	);
}

export default compraproveedor;