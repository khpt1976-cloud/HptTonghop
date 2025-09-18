import React, { useState, useEffect } from 'react';
import {
  Form,
  Input,
  Select,
  InputNumber,
  Switch,
  Button,
  Space,
  Card,
  Row,
  Col,
  message,
  TreeSelect,
  Divider,
} from 'antd';
import {
  SaveOutlined,
  CloseOutlined,
  MenuOutlined,
  FileOutlined,
  LinkOutlined,
  MinusOutlined,
} from '@ant-design/icons';
import { useTranslation } from 'react-i18next';
import { NavigationItem, NavigationFormData } from '../../types/navigation';
import { NavigationServiceWrapper as NavigationService } from '../../services/navigationServiceWrapper';
import NavigationUtils from '../../utils/navigationUtils';

const { Option } = Select;
const { TextArea } = Input;

interface NavigationFormProps {
  item?: NavigationItem;
  onSave: (data: NavigationFormData) => Promise<void>;
  onCancel: () => void;
  loading?: boolean;
}

const NavigationForm: React.FC<NavigationFormProps> = ({
  item,
  onSave,
  onCancel,
  loading = false,
}) => {
  const { t } = useTranslation();
  const [form] = Form.useForm();
  const [parentOptions, setParentOptions] = useState<NavigationItem[]>([]);
  const [loadingParents, setLoadingParents] = useState(false);
  const [pathValidating, setPathValidating] = useState(false);

  const isEditing = !!item;

  // Load parent options
  useEffect(() => {
    loadParentOptions();
  }, [item]);

  const loadParentOptions = async () => {
    setLoadingParents(true);
    try {
      const parents = await NavigationService.getParentOptions(item?.id);
      setParentOptions(parents);
    } catch (error) {
      console.error('Error loading parent options:', error);
      message.error('Error loading parent options');
    } finally {
      setLoadingParents(false);
    }
  };

  // Initialize form values
  useEffect(() => {
    if (item) {
      form.setFieldsValue({
        name: item.name,
        path: item.path,
        icon: item.icon,
        order: item.order,
        isVisible: item.isVisible,
        parentId: item.parentId,
        type: item.type,
        permissions: item.permissions?.join(', ') || '',
      });
    } else {
      form.setFieldsValue({
        name: '',
        path: '',
        icon: '',
        order: 1,
        isVisible: true,
        parentId: undefined,
        type: 'menu',
        permissions: '',
      });
    }
  }, [item, form]);

  // Handle form submission
  const handleSubmit = async (values: any) => {
    try {
      const formData: NavigationFormData = {
        name: values.name.trim(),
        path: values.path.trim(),
        icon: values.icon?.trim() || undefined,
        order: values.order,
        isVisible: values.isVisible,
        parentId: values.parentId || undefined,
        type: values.type,
        permissions: values.permissions
          ? values.permissions.split(',').map((p: string) => p.trim()).filter(Boolean)
          : undefined,
      };

      await onSave(formData);
    } catch (error) {
      console.error('Error saving navigation item:', error);
    }
  };

  // Validate path uniqueness
  const validatePath = async (_rule: any, value: string) => {
    if (!value || !value.trim()) {
      return Promise.resolve();
    }

    setPathValidating(true);
    try {
      const isValid = await NavigationService.validatePath(value.trim(), item?.id);
      if (!isValid) {
        return Promise.reject(new Error(t('navigation.validation.pathExists')));
      }
      return Promise.resolve();
    } catch (error) {
      return Promise.reject(new Error(t('navigation.validation.pathValidationError')));
    } finally {
      setPathValidating(false);
    }
  };

  // Validate parent selection
  const validateParent = (_rule: any, value: string) => {
    if (!value) {
      return Promise.resolve();
    }

    if (item && NavigationUtils.wouldCreateCircularReference(parentOptions, item.id, value)) {
      return Promise.reject(new Error(t('navigation.validation.parentSelf')));
    }

    return Promise.resolve();
  };

  // Get type icon (commented out as unused)
  // const getTypeIcon = (type: NavigationType) => {
  //   switch (type) {
  //     case 'menu':
  //       return <MenuOutlined />;
  //     case 'page':
  //       return <FileOutlined />;
  //     case 'link':
  //       return <LinkOutlined />;
  //     case 'divider':
  //       return <MinusOutlined />;
  //     default:
  //       return <MenuOutlined />;
  //   }
  // };

  // Convert parent options to tree data
  const getParentTreeData = () => {
    const tree = NavigationUtils.buildNavigationTree(parentOptions);
    return NavigationUtils.convertToTreeData(tree);
  };

  return (
    <Card
      title={
        <Space>
          {isEditing ? (
            <>
              <FileOutlined />
              {t('navigation.edit')}
            </>
          ) : (
            <>
              <MenuOutlined />
              {t('navigation.add')}
            </>
          )}
        </Space>
      }
      extra={
        <Button
          type="text"
          icon={<CloseOutlined />}
          onClick={onCancel}
          size="small"
        />
      }
    >
      <Form
        form={form}
        layout="vertical"
        onFinish={handleSubmit}
        autoComplete="off"
        scrollToFirstError
      >
        <Row gutter={[16, 0]}>
          {/* Basic Information */}
          <Col xs={24} md={12}>
            <Form.Item
              name="name"
              label={t('navigation.fields.name')}
              rules={[
                { required: true, message: t('navigation.validation.nameRequired') },
                { max: 100, message: t('navigation.validation.nameTooLong') },
              ]}
            >
              <Input
                placeholder={t('navigation.fields.name')}
                maxLength={100}
                showCount
              />
            </Form.Item>
          </Col>

          <Col xs={24} md={12}>
            <Form.Item
              name="path"
              label={t('navigation.fields.path')}
              rules={[
                { required: true, message: t('navigation.validation.pathRequired') },
                {
                  pattern: /^\/[a-zA-Z0-9\-_\/]*$/,
                  message: t('navigation.validation.pathInvalid'),
                },
                { validator: validatePath },
              ]}
              validateStatus={pathValidating ? 'validating' : undefined}
            >
              <Input
                placeholder="/example/path"
                prefix="/"
                addonBefore="Path"
              />
            </Form.Item>
          </Col>

          {/* Type and Icon */}
          <Col xs={24} md={12}>
            <Form.Item
              name="type"
              label={t('navigation.fields.type')}
              rules={[{ required: true, message: t('navigation.validation.typeRequired') }]}
            >
              <Select placeholder={t('navigation.fields.type')}>
                <Option value="menu">
                  <Space>
                    <MenuOutlined />
                    {t('navigation.types.menu')}
                  </Space>
                </Option>
                <Option value="page">
                  <Space>
                    <FileOutlined />
                    {t('navigation.types.page')}
                  </Space>
                </Option>
                <Option value="link">
                  <Space>
                    <LinkOutlined />
                    {t('navigation.types.link')}
                  </Space>
                </Option>
                <Option value="divider">
                  <Space>
                    <MinusOutlined />
                    {t('navigation.types.divider')}
                  </Space>
                </Option>
              </Select>
            </Form.Item>
          </Col>

          <Col xs={24} md={12}>
            <Form.Item
              name="icon"
              label={t('navigation.fields.icon')}
              tooltip="Ant Design icon name (e.g., UserOutlined, HomeOutlined)"
            >
              <Input
                placeholder="UserOutlined"
                maxLength={50}
              />
            </Form.Item>
          </Col>

          {/* Order and Visibility */}
          <Col xs={24} md={12}>
            <Form.Item
              name="order"
              label={t('navigation.fields.order')}
              rules={[
                { required: true, message: t('navigation.validation.orderRequired') },
                { type: 'number', min: 1, message: t('navigation.validation.orderInvalid') },
              ]}
            >
              <InputNumber
                min={1}
                max={9999}
                style={{ width: '100%' }}
                placeholder="1"
              />
            </Form.Item>
          </Col>

          <Col xs={24} md={12}>
            <Form.Item
              name="isVisible"
              label={t('navigation.fields.isVisible')}
              valuePropName="checked"
            >
              <Switch
                checkedChildren={t('common.active')}
                unCheckedChildren={t('common.inactive')}
              />
            </Form.Item>
          </Col>

          {/* Parent Selection */}
          <Col xs={24}>
            <Form.Item
              name="parentId"
              label={t('navigation.fields.parentId')}
              rules={[{ validator: validateParent }]}
            >
              <TreeSelect
                placeholder={t('navigation.fields.parentId')}
                allowClear
                showSearch
                treeDefaultExpandAll
                treeData={getParentTreeData()}
                loading={loadingParents}
                dropdownStyle={{ maxHeight: 400, overflow: 'auto' }}
                treeNodeFilterProp="title"
              />
            </Form.Item>
          </Col>

          {/* Permissions */}
          <Col xs={24}>
            <Form.Item
              name="permissions"
              label={t('navigation.fields.permissions')}
              tooltip="Comma-separated list of permissions (e.g., admin, user, editor)"
            >
              <TextArea
                placeholder="admin, user, editor"
                rows={2}
                maxLength={500}
                showCount
              />
            </Form.Item>
          </Col>
        </Row>

        <Divider />

        {/* Form Actions */}
        <Row justify="end">
          <Col>
            <Space>
              <Button onClick={onCancel}>
                <CloseOutlined />
                {t('common.cancel')}
              </Button>
              <Button
                type="primary"
                htmlType="submit"
                loading={loading}
                icon={<SaveOutlined />}
              >
                {t('common.save')}
              </Button>
            </Space>
          </Col>
        </Row>
      </Form>
    </Card>
  );
};

export default NavigationForm;