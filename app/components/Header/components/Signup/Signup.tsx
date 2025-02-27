import { Form, Link } from '@remix-run/react';
import {
    Card,
    Box,
    Button,
    BlockStack,
    FormLayout,
    Text,
    InlineStack /*Form, Link*/,
} from '@shopify/polaris';
import React, { useState } from 'react';

import FormInput from '~/components/common/FormInput/FormInput';

const Signup = ({ closeModal }: { closeModal: () => void }) => {
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [error, setError] = useState('');

    const handlePasswordChange = (value: string) => {
        setPassword(value);
        setError('');
    };

    const handleConfirmPasswordChange = (value: string) => {
        setConfirmPassword(value);
        setError('');
    };

    const handleSubmit = (event: React.FormEvent) => {
        if (password !== confirmPassword) {
            event.preventDefault();
            setError('Passwords do not match');
        } else {
            closeModal();
        }
    };

    return (
        <Card>
            <Box>
                <BlockStack gap={500} align={'center'} inlineAlign={'center'}>
                    <Text variant="heading2xl" as="h3">
                        Signup
                    </Text>

                    {/*<Form method="post" action="/signup" onSubmit={closeModal}>*/}
                    <Form
                        method="post"
                        action="/signup"
                        onSubmit={handleSubmit}
                    >
                        <FormLayout>
                            <FormInput
                                type={'text'}
                                name={'firstName'}
                                required={true}
                                label={'First name'}
                                placeholder={'First name'}
                            />
                            <FormInput
                                type={'text'}
                                name={'lastName'}
                                required={true}
                                label={'Last name'}
                                placeholder={'Last name'}
                            />
                            <FormInput
                                type={'email'}
                                name={'email'}
                                required={true}
                                label={'Email'}
                                placeholder={'Your Email'}
                            />
                            <FormInput
                                type={'password'}
                                name={'password'}
                                required={true}
                                label={'Password'}
                                placeholder={'Your Password'}
                                onChange={handlePasswordChange}
                            />
                            <FormInput
                                type={'password'}
                                name={'confirmPassword'}
                                required={true}
                                label={'Confirm Password'}
                                placeholder={'Confirm Password'}
                                onChange={handleConfirmPasswordChange}
                            />

                            {error && (
                                <Text as="p" variant="bodySm" tone="critical">
                                    {error}
                                </Text>
                            )}

                            <Box paddingBlockStart={300}>
                                <Button
                                    submit
                                    fullWidth
                                    size="large"
                                    variant={'primary'}
                                    // disabled={error !== ""}
                                >
                                    Sign up
                                </Button>
                            </Box>
                        </FormLayout>
                    </Form>
                </BlockStack>
            </Box>
        </Card>
    );
};

export default Signup;
