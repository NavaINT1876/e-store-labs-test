import './ProductInformationForm.css';
import {Button, Form} from 'react-bootstrap';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'react-quill/dist/quill.snow.css';
import ReactQuill from 'react-quill';
import React, {useState} from 'react';
import CreatableSelect from 'react-select/creatable';
import {HTML5Backend} from 'react-dnd-html5-backend';
import {DndProvider} from 'react-dnd';
import {FieldPath, SubmitHandler, useForm} from 'react-hook-form';
import Bullets from './Bullets';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import {z} from 'zod';
import {zodResolver} from '@hookform/resolvers/zod';

interface BulletInterface {
    id: number;
    order: number;
    text: string;
}
interface CreatableSelectOptions {
    value: string;
    label: string;
}

const ProductInformationForm = () => {
    const requirementMessage = 'This field is required';
    const FormSchema = z.object({
        title: z.string().min(1, {message: requirementMessage}).max(255),
        description: z.string().optional(),
        keywords: z.array(z.string()).optional(),
        bullets: z.array(z.object({
            id: z.number(),
            order: z.number(),
            text: z.string(),
        })).optional(),
    });

    type FormSchemaType = z.infer<typeof FormSchema>;

    const {
        register,
        handleSubmit,
        setValue,
        formState: {errors},
    } = useForm<FormSchemaType>({resolver: zodResolver(FormSchema)});

    const [bullets, setBullets] = useState([])<BulletInterface>;

    const onSubmit: SubmitHandler<FormSchemaType> = data => console.log(data);

    const handleAddBullet = () => {
        let id = 1;
        if (bullets.length > 0) {
            const max = Math.max(...bullets.map(bullet => +bullet.id));
            id = max + 1;
        }
        setBullets([...bullets, {id, order: id, text: ''}]);
    };

    const handleSetBullets = (inputBullets: BulletInterface[]) => {
        setBullets(inputBullets);
        setValue('bullets' as FieldPath<FormSchemaType>, inputBullets);
    };

    const handleKeywordsChange = (v: CreatableSelectOptions[]) => setValue('keywords' as FieldPath<FormSchemaType>, v.map((i: CreatableSelectOptions) => i.value));

    return (
        <div className='ProductInformationForm w-responsive mw-60 p-lg-5 p-sm-3'>
            <h1 className='mt-3 mb-5'>Product information form</h1>
            <Form onSubmit={handleSubmit(onSubmit)}>
                <Form.Group className='mb-4' controlId='title'>
                    <Form.Label className='fw-bold'>Title</Form.Label>
                    <Form.Control type='text'
                                  placeholder='Product title' {...register('title' as FieldPath<FormSchemaType>, {required: true})} />
                    {errors['title'] && <span className='text-danger'>{requirementMessage}</span>}
                </Form.Group>
                <Row>
                    <Col sm={12} md={8}>
                        <Form.Group className='mb-4' controlId='description'>
                            <Form.Label className='fw-bold'>Description</Form.Label>
                            <ReactQuill
                                onChange={(v: string) => setValue('description' as FieldPath<FormSchemaType>, v)}
                            />
                        </Form.Group>
                    </Col>
                    <Col sm={12} md={4}>
                        <Form.Group className='mb-4' controlId='keywords'>
                            <Form.Label className='fw-bold'>Keywords</Form.Label>
                            <CreatableSelect isClearable isMulti onChange={handleKeywordsChange}/>
                        </Form.Group>
                    </Col>
                </Row>
                <Form.Group className='mb-4' controlId='description'>
                    <Form.Label className='fw-bold'>Bullets</Form.Label>
                    <DndProvider backend={HTML5Backend}>
                        <Bullets bullets={bullets} setBullets={handleSetBullets}/>
                    </DndProvider>
                    <Button variant='link' type='button' onClick={handleAddBullet} className='d-block'>+ Add
                        bullet</Button>
                </Form.Group>
                <Button variant='primary' type='submit'>Submit</Button>
            </Form>
        </div>
    );
};

export default ProductInformationForm;
