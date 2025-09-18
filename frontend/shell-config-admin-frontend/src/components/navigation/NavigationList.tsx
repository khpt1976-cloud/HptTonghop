import React, { useState, useEffect } from 'react';
import {
  Table,
  Button,
  Space,
  Input,
  Select,
  Switch,
  Tag,
  Popconfirm,
  message,
  Tooltip,
  Tree,
  Card,
  Row,
  Col,
  Spin,
} from 'antd';
import {
  PlusOutlined,
  EditOutlined,
  DeleteOutlined,
  SearchOutlined,
  ReloadOutlined,
  EyeOutlined,
  EyeInvisibleOutlined,
  MenuOutlined,
  LinkOutlined,
  FileOutlined,
  MinusOutlined,
} from '@ant-design/icons';
import { useTranslation } from 'react-i18next';
import type { ColumnsType } from 'antd/es/table';
import { NavigationItem, NavigationType, NavigationTreeNode } from '../../types/navigation';
import { LoadingState } from '../../types/common';
import NavigationService from '../../services/navigationService';
import NavigationUtils from '../../utils/navigationUtils';

const { Search } = Input;
const { Option } = Select;

interface NavigationListProps {
  onAdd: () => void;
  onEdit: (item: NavigationItem) => void;
  onRefresh?: () => void;
  viewMode?: 'table' | 'tree';
}

const NavigationList: React.FC<NavigationListProps> = ({
  onAdd,
  onEdit,
  onRefresh,
  viewMode = 'table',
}) => {
  const { t } = useTranslation();
  const [navigationItems, setNavigationItems] = useState<NavigationItem[]>([]);
  const [filteredItems, setFilteredItems] = useState<NavigationItem[]>([]);
  const [treeData, setTreeData] = useState<NavigationTreeNode[]>([]);
  const [loading, setLoading] = useState<LoadingState>('idle');
  const [searchTerm, setSearchTerm] = useState('');
  const [typeFilter, setTypeFilter] = useState<NavigationType | 'all'>('all');
  const [visibilityFilter, setVisibilityFilter] = useState<boolean | 'all'>('all');
  const [expandedKeys, setExpandedKeys] = useState<string[]>([]);
  const [selectedKeys, setSelectedKeys] = useState<string[]>([]);

  // Load navigation items
  const loadNavigationItems = async () => {
    setLoading('loading');
    try {
      const response = await NavigationService.getNavigationTree();
      setNavigationItems(response);
      setLoading('success');
    } catch (error) {
      console.error('Error loading navigation items:', error);
      message.error(t('navigation.messages.loadError'));
      setLoading('error');
    }
  };

  // Initial load
  useEffect(() => {
    loadNavigationItems();
  }, []);

  // Filter items when search term or filters change
  useEffect(() => {
    let filtered = [...navigationItems];

    // Apply search filter
    if (searchTerm.trim()) {
      filtered = NavigationUtils.filterNavigationItems(filtered, searchTerm);
    }

    // Apply type filter
    if (typeFilter !== 'all') {
      const filterByType = (items: NavigationItem[]): NavigationItem[] => {
        return items
          .filter(item => item.type === typeFilter)
          .map(item => ({
            ...item,
            children: item.children ? filterByType(item.children) : undefined,
          }));
      };
      filtered = filterByType(filtered);
    }

    // Apply visibility filter
    if (visibilityFilter !== 'all') {
      const filterByVisibility = (items: NavigationItem[]): NavigationItem[] => {
        return items
          .filter(item => item.isVisible === visibilityFilter)
          .map(item => ({
            ...item,
            children: item.children ? filterByVisibility(item.children) : undefined,
          }));
      };
      filtered = filterByVisibility(filtered);
    }

    setFilteredItems(filtered);
    setTreeData(NavigationUtils.convertToTreeData(filtered));
  }, [navigationItems, searchTerm, typeFilter, visibilityFilter]);

  // Handle delete
  const handleDelete = async (id: string) => {
    try {
      await NavigationService.deleteNavigationItem(id);
      message.success(t('navigation.messages.deleteSuccess'));
      loadNavigationItems();
    } catch (error) {
      console.error('Error deleting navigation item:', error);
      message.error(t('navigation.messages.deleteError'));
    }
  };

  // Handle visibility toggle
  const handleVisibilityToggle = async (item: NavigationItem) => {
    try {
      await NavigationService.updateNavigationItem(item.id, {
        isVisible: !item.isVisible,
      });
      message.success(t('navigation.messages.editSuccess'));
      loadNavigationItems();
    } catch (error) {
      console.error('Error updating navigation item:', error);
      message.error(t('navigation.messages.saveError'));
    }
  };

  // Get type icon
  const getTypeIcon = (type: NavigationType) => {
    switch (type) {
      case 'menu':
        return <MenuOutlined />;
      case 'page':
        return <FileOutlined />;
      case 'link':
        return <LinkOutlined />;
      case 'divider':
        return <MinusOutlined />;
      default:
        return <MenuOutlined />;
    }
  };

  // Get type color
  const getTypeColor = (type: NavigationType) => {
    switch (type) {
      case 'menu':
        return 'blue';
      case 'page':
        return 'green';
      case 'link':
        return 'orange';
      case 'divider':
        return 'gray';
      default:
        return 'blue';
    }
  };

  // Table columns
  const columns: ColumnsType<NavigationItem> = [
    {
      title: t('navigation.fields.name'),
      dataIndex: 'name',
      key: 'name',
      width: 200,
      render: (text, record) => (
        <Space>
          {getTypeIcon(record.type)}
          <span>{text}</span>
        </Space>
      ),
    },
    {
      title: t('navigation.fields.path'),
      dataIndex: 'path',
      key: 'path',
      width: 200,
      render: (text) => (
        <code className="bg-gray-100 px-2 py-1 rounded text-sm">{text}</code>
      ),
    },
    {
      title: t('navigation.fields.type'),
      dataIndex: 'type',
      key: 'type',
      width: 100,
      render: (type: NavigationType) => (
        <Tag color={getTypeColor(type)} icon={getTypeIcon(type)}>
          {t(`navigation.types.${type}`)}
        </Tag>
      ),
    },
    {
      title: t('navigation.fields.order'),
      dataIndex: 'order',
      key: 'order',
      width: 80,
      sorter: (a, b) => a.order - b.order,
    },
    {
      title: t('navigation.fields.isVisible'),
      dataIndex: 'isVisible',
      key: 'isVisible',
      width: 100,
      render: (isVisible, record) => (
        <Switch
          checked={isVisible}
          onChange={() => handleVisibilityToggle(record)}
          checkedChildren={<EyeOutlined />}
          unCheckedChildren={<EyeInvisibleOutlined />}
        />
      ),
    },
    {
      title: t('navigation.fields.permissions'),
      dataIndex: 'permissions',
      key: 'permissions',
      width: 150,
      render: (permissions: string[]) => (
        <div>
          {permissions && permissions.length > 0 ? (
            permissions.map((permission, index) => (
              <Tag key={index} size="small">
                {permission}
              </Tag>
            ))
          ) : (
            <span className="text-gray-400">-</span>
          )}
        </div>
      ),
    },
    {
      title: t('common.actions'),
      key: 'actions',
      width: 120,
      fixed: 'right',
      render: (_, record) => (
        <Space size="small">
          <Tooltip title={t('common.edit')}>
            <Button
              type="text"
              icon={<EditOutlined />}
              onClick={() => onEdit(record)}
              size="small"
            />
          </Tooltip>
          <Popconfirm
            title={t('navigation.deleteConfirm')}
            onConfirm={() => handleDelete(record.id)}
            okText={t('common.yes')}
            cancelText={t('common.no')}
          >
            <Tooltip title={t('common.delete')}>
              <Button
                type="text"
                danger
                icon={<DeleteOutlined />}
                size="small"
              />
            </Tooltip>
          </Popconfirm>
        </Space>
      ),
    },
  ];

  // Tree node render
  const renderTreeNode = (node: NavigationTreeNode) => (
    <div className="flex items-center justify-between w-full">
      <Space>
        {getTypeIcon(node.type)}
        <span>{node.name}</span>
        <code className="bg-gray-100 px-1 rounded text-xs">{node.path}</code>
        <Tag color={getTypeColor(node.type)} size="small">
          {t(`navigation.types.${node.type}`)}
        </Tag>
        {!node.isVisible && <EyeInvisibleOutlined className="text-gray-400" />}
      </Space>
      <Space size="small">
        <Button
          type="text"
          icon={<EditOutlined />}
          onClick={(e) => {
            e.stopPropagation();
            onEdit(node);
          }}
          size="small"
        />
        <Popconfirm
          title={t('navigation.deleteConfirm')}
          onConfirm={(e) => {
            e?.stopPropagation();
            handleDelete(node.id);
          }}
          okText={t('common.yes')}
          cancelText={t('common.no')}
          onCancel={(e) => e?.stopPropagation()}
        >
          <Button
            type="text"
            danger
            icon={<DeleteOutlined />}
            size="small"
            onClick={(e) => e.stopPropagation()}
          />
        </Popconfirm>
      </Space>
    </div>
  );

  const handleRefresh = () => {
    loadNavigationItems();
    onRefresh?.();
  };

  return (
    <div className="navigation-list">
      <Card>
        {/* Filters and Actions */}
        <Row gutter={[16, 16]} className="mb-4">
          <Col xs={24} sm={12} md={8}>
            <Search
              placeholder={t('common.search')}
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              allowClear
              prefix={<SearchOutlined />}
            />
          </Col>
          <Col xs={12} sm={6} md={4}>
            <Select
              value={typeFilter}
              onChange={setTypeFilter}
              style={{ width: '100%' }}
              placeholder={t('navigation.fields.type')}
            >
              <Option value="all">{t('common.all')}</Option>
              <Option value="menu">{t('navigation.types.menu')}</Option>
              <Option value="page">{t('navigation.types.page')}</Option>
              <Option value="link">{t('navigation.types.link')}</Option>
              <Option value="divider">{t('navigation.types.divider')}</Option>
            </Select>
          </Col>
          <Col xs={12} sm={6} md={4}>
            <Select
              value={visibilityFilter}
              onChange={setVisibilityFilter}
              style={{ width: '100%' }}
              placeholder={t('navigation.fields.isVisible')}
            >
              <Option value="all">{t('common.all')}</Option>
              <Option value={true}>{t('common.active')}</Option>
              <Option value={false}>{t('common.inactive')}</Option>
            </Select>
          </Col>
          <Col xs={24} sm={24} md={8}>
            <Space className="w-full justify-end">
              <Button
                icon={<ReloadOutlined />}
                onClick={handleRefresh}
                loading={loading === 'loading'}
              >
                {t('common.refresh')}
              </Button>
              <Button
                type="primary"
                icon={<PlusOutlined />}
                onClick={onAdd}
              >
                {t('navigation.add')}
              </Button>
            </Space>
          </Col>
        </Row>

        {/* Content */}
        <Spin spinning={loading === 'loading'}>
          {viewMode === 'table' ? (
            <Table
              columns={columns}
              dataSource={NavigationUtils.flattenNavigationTree(filteredItems)}
              rowKey="id"
              pagination={{
                showSizeChanger: true,
                showQuickJumper: true,
                showTotal: (total, range) =>
                  `${range[0]}-${range[1]} of ${total} items`,
              }}
              scroll={{ x: 800 }}
              size="small"
            />
          ) : (
            <Tree
              treeData={treeData}
              expandedKeys={expandedKeys}
              selectedKeys={selectedKeys}
              onExpand={setExpandedKeys}
              onSelect={setSelectedKeys}
              titleRender={renderTreeNode}
              showLine
              showIcon={false}
            />
          )}
        </Spin>
      </Card>
    </div>
  );
};

export default NavigationList;