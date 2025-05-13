import comprarAproveedor from "@/components/ComprarAProveedor";
import MostrarInventario from "@/components/TablaCompras";

const Form2 = comprarAproveedor
const Form1 = MostrarInventario


function compraproveedor() {
	return (
		<div style={{
			display: 'flex',
			width: '99vw',	//100% ancho pantalla
			height: '128vh',	//100% alto pantalla
			border: '2px #CCA9DD',
			padding: '20px',
			backgroundColor: '#CCA9DD',
		}}> 
			<Form1 />
			<Form2 />
		</div>
	);
}

export default compraproveedor;