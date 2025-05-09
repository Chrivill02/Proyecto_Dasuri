import comprarAproveedor from "@/components/ComprarAProveedor";
import comprasform from "@/components/CompraFactura";

const Form3 = comprarAproveedor
const Form4 = comprasform


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
			<Form3 />
			<Form4 />
		</div>
	);
}

export default compraproveedor;