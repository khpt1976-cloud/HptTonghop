import React, { useState, useCallback } from 'react';
import {
  Row,
  Col,
  Card,
  Button,
  Space,
  Modal,
  message,
  Segmented,
  Typography,
} from 'antd';
import {
  TableOutlined,
  ApartmentOutlined,
  PlusOutlined,
  ReloadOutlined,
} from '@ant-design/icons';
import { useTranslation } from 'react-i18next';
import NavigationList from '../../components/navigation/NavigationList';
import NavigationForm from '../../components/navigation/NavigationForm';
import { NavigationItem, NavigationFormData } from '../../types/navigation';
import { LoadingState } from '../../types/common';
import NavigationService from '../../services/navigationService';
import EmbeddedModeUtils from '../../utils/embeddedMode';

const { Title } = Typography;

type ViewMode = 'table' | 'tree';

const NavigationManagement: React.FC = () => {
  const { t } = useTranslation();
  const [viewMode, setViewMode] = useState<ViewMode>('table');
  const [showForm, setShowForm] = useState(false);
  const [editingItem, setEditingItem] = useState<NavigationItem | undefined>();
  const [loading, setLoading] = useState<LoadingState>('idle');
  const [refreshTrigger, setRefreshTrigger] = useState(0);

  // Handle add new navigation item
  const handleAdd = useCallback(() => {
    setEditingItem(undefined);
    setShowForm(true);
  }, []);

  // Handle edit navigation item
  const handleEdit = useCallback((item: NavigationItem) => {
    setEditingItem(item);
    setShowForm(true);
  }, []);

  // Handle save navigation item
  const handleSave = useCallback(async (data: NavigationFormData) => {
    setLoading('loading');
    try {
      if (editingItem) {
        // Update existing item
        await NavigationService.updateNavigationItem(editingItem.id, data);
        message.success(t('navigation.messages.editSuccess'));
      } else {
        // Create new item
        await NavigationService.createNavigationItem(data);
        message.success(t('navigation.messages.addSuccess'));
      }
      
      setShowForm(false);
      setEditingItem(undefined);
      setRefreshTrigger(prev => prev + 1);
      
      // Notify parent app about navigation changes
      EmbeddedModeUtils.sendMessageToParent('navigation-updated', {
        action: editingItem ? 'update' : 'create',
        item: data,
      });
      
    } catch (error) {
      console.error('Error saving navigation item:', error);
      message.error(t('navigation.messages.saveError'));
    } finally {
      setLoading('success');
    }
  }, [editingItem, t]);

  // Handle cancel form
  const handleCancel = useCallback(() => {
    setShowForm(false);
    setEditingItem(undefined);
  }, []);

  // Handle refresh
  const handleRefresh = useCallback(() => {
    setRefreshTrigger(prev => prev + 1);
    message.success(t('common.refreshed'));
  }, [t]);

  // View mode options
  const viewModeOptions = [
    {
      label: (
        <Space>
          <TableOutlined />
          {t('common.table')}
        </Space>
      ),
      value: 'table',
    },
    {
      label: (
        <Space>
          <ApartmentOutlined />
          {t('common.tree')}
        </Space>
      ),
      value: 'tree',
    },
  ];

  const isEmbedded = EmbeddedModeUtils.isEmbedded();

  return (
    <div className="navigation-management">
      {/* Header - Only show if not embedded */}
      {!isEmbedded && (
        <div className="mb-6">
          <Title level={2} className="mb-2">
            {t('navigation.title')}
          </Title>
          <p className="text-gray-600">
            {t('navigation.description')}
          </p>
        </div>
      )}

      {/* Controls */}
      <Card className="mb-4">
        <Row justify="space-between" align="middle">
          <Col>
            <Space>
              <Segmented
                options={viewModeOptions}
                value={viewMode}
                onChange={(value) => setViewMode(value as ViewMode)}
              />
            </Space>
          </Col>
          <Col>
            <Space>
              <Button
                icon={<ReloadOutlined />}
                onClick={handleRefresh}
                title={t('common.refresh')}
              >
                {t('common.refresh')}
              </Button>
              <Button
                type="primary"
                icon={<PlusOutlined />}
                onClick={handleAdd}
              >
                {t('navigation.add')}
              </Button>
            </Space>
          </Col>
        </Row>
      </Card>

      {/* Navigation List */}
      <NavigationList
        onAdd={handleAdd}
        onEdit={handleEdit}
        onRefresh={handleRefresh}
        viewMode={viewMode}
        key={refreshTrigger} // Force re-render when refreshTrigger changes
      />

      {/* Navigation Form Modal */}
      <Modal
        title={editingItem ? t('navigation.edit') : t('navigation.add')}
        open={showForm}
        onCancel={handleCancel}
        footer={null}
        width={800}
        destroyOnClose
        maskClosable={false}
        style={{ top: 20 }}
      >
        <NavigationForm
          item={editingItem}
          onSave={handleSave}
          onCancel={handleCancel}
          loading={loading === 'loading'}
        />
      </Modal>
    </div>
  );
};

export default NavigationManagement;