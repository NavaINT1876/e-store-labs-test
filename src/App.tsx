import ProductInformationForm from './component/ProductInformationForm';
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';

const App = () => {
    return (
        <div className='App'>
            <Container fluid='lg'>
                <Row>
                    <Col>
                        <ProductInformationForm/>
                    </Col>
                </Row>
            </Container>
        </div>
    );
};

export default App;
