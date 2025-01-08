<template>
  <!--最外层-->
  <div class="flex justify-center bgc-main id232" style="width: 100%;">
    <!--内容-->
    <div class="flex flex-direction" style="width: 75.45%;min-width: var(--main-div-min-width);max-width: 1200px;">
      <!--上-->
      <div
        class="flex flex-direction margin-top-16 padding-bottom-12 bgc-white box-shadow-1 border-radius-4"
        style="width: 100%;position:relative;padding-left: 4.48%;padding-right: 4.48%;"
      >
        <!--返回-->
        <div class="flex" style="position: absolute;top: 12px;right: 12px;">
          <el-button class="return-btn" icon="el-icon-caret-left" style="margin-right: 20px;" @click="goBack">返回</el-button>
        </div>
        <!--标题-->
        <div class="flex align-center border-bottom font-weight-500 color-title font-size-16" style="height: 54px;width: 100%;line-height: 16px;">
          查看
        </div>
        <!--小标题-->
        <div class="flex margin-top-8" style="width: 100%;">
          <title-style title="基本信息">
            <!--            <i class="el-icon-edit-outline hand margin-left-8 color-content hover-to-blue" @click="showChangeUserInfoDialog = true" />-->
            <svg-icon
              class="hand margin-left-8 hover-to-blue"
              class-name="dataset-edit-icon"
              icon-class="dataset-edit"
              @click="showChangeUserInfoDialog = true"
            />
          </title-style>
        </div>
        <!--内容-->
        <div class="flex" style="width: 100%;">
          <el-form label-width="73px" label-suffix=":" :inline="true" style="margin-top: 0;width: 100%;">
            <el-form-item label="账号" prop="userName" style="width: 30%;min-width: 288px;max-width: 30%;">
              <span class="color-content" style="width: 100%;">{{ userInfo.userName }}</span>
            </el-form-item>
            <el-form-item label="密码" prop="password" style="width: 30%;min-width: 288px;max-width: 30%;">
              <!--              <span class="color-content margin-right-8">{{userInfo.password}}</span>-->
              <div class="flex align-center" style="width: 100%;">
                <span class="color-content margin-right-8">******</span>
                <el-button class="white-btn-hpj" @click="showResetPasswordDialog = true">重置密码</el-button>
              </div>
            </el-form-item>
            <el-form-item label="姓名" prop="nickName" style="width: 30%;min-width: 288px;max-width: 30%;">
              <span class="color-content text-hidden" style="width: 100%;">{{ userInfo.nickName }}</span>
            </el-form-item>
            <el-form-item label="单位" prop="company" style="width: 30%;min-width: 288px;max-width: 30%;">
              <span class="color-content text-hidden" style="width: 100%;">{{ userInfo.company }}</span>
            </el-form-item>
            <el-form-item label="角色" prop="roleName" style="width: 30%;min-width: 288px;max-width: 30%;">
              <span class="color-content text-hidden" style="width: 100%;">{{ userInfo.roleName }}</span>
            </el-form-item>
            <el-form-item label="手机号" prop="phonenumber" style="width: 30%;min-width: 288px;max-width: 30%;">
              <span class="color-content text-hidden" style="width: 100%;">{{ userInfo.phonenumber }}</span>
            </el-form-item>
            <el-form-item label="邮箱" prop="email" style="width: 30%;min-width: 288px;max-width: 30%;">
              <span class="color-content text-hidden" style="width: 100%;">{{ userInfo.email }}</span>
            </el-form-item>
            <el-form-item label="创建时间" prop="createTime" style="width: 30%;min-width: 288px;max-width: 30%;">
              <span v-if="userInfo" class="color-content text-hidden" style="width: 100%;">{{ userInfo.createTime && userInfo.createTime.split(' ')[0] }}</span>
            </el-form-item>
            <el-form-item label="到期时间" prop="endDate" style="width: 30%;min-width: 288px;max-width: 30%;">
              <div class="flex align-center" style="width: 100%;height: 36px;">
                <span v-if="userInfo" class="color-content margin-right-8 text-hidden">{{ userInfo.endDate && userInfo.endDate.split(' ')[0] }}</span>
                <el-button class="white-btn-hpj" @click="showSetTimeDialog = true">设置期限</el-button>
              </div>
            </el-form-item>
          </el-form>
        </div>
      </div>
      <!--下-->
      <div
        class="flex flex-direction margin-top-16 margin-bottom-16 padding-bottom-16 bgc-white box-shadow-1 border-radius-4"
        style="width: 100%;padding-left: 4.48%;padding-right: 4.48%;min-height: calc(100vh - 325px);"
      >
        <!--标签-->
        <div class="flex align-center margin-top-24" style="width: 100%;">
          <div class="flex align-center color-content font-size-14">
            <span class="margin-right-16">模型({{ modelNum }})</span>
            <span class="margin-right-16">数据集({{ dataSetNum }})</span>
          </div>
        </div>
        <!--tab-->
        <div class="flex align-center margin-top-12" style="width: 100%;">
          <hpj-tabs :tab-list="tabList" :active-tab.sync="activeTab" @change="changeActiveTab" />
        </div>
        <!--菜单栏-->
        <div :key="activeTab" class="flex justify-between align-center margin-top-12" style="width: 100%;">
          <!--左-->
          <div class="flex align-center">
            <input-with-search
              v-if="!activeTabIsNotebook"
              :key="activeTab"
              :placeholder="activeTab==='模型'?'请输入模型名称':'请输入数据集名称'"
              class="notebook-search-container"
              @search="search"
            />
          </div>
          <!--右-->
          <div class="flex">
            <!--模型，数据集-->
            <div v-if="!activeTabIsNotebook && userInfo.roleName !== '超级管理员'" class="flex align-center">
              <el-button
                type="primary"
                style="width: 120px;border-radius: 4px;font-size: 12px;"
                :disabled="selectedDataList.length === 0"
                @click="showBatchCancelAuthorizationDialog = true"
              >批量取消授权</el-button>
              <el-button
                type="primary"
                style="width: 96px;box-shadow: 0 2px 6px 1px rgba(183,217,255,0.47);border-radius: 4px;font-size: 12px;margin-left: 16px;"
                @click="showAuthorizeDialog = true"
              >授权</el-button>
            </div>
            <!--notebook页面-->
            <div v-if="activeTab==='Notebooks资源配置'" class="flex align-center">
              <el-button
                v-show="!notebookSet"
                type="primary"
                style="width: 96px;box-shadow: 0 2px 6px 1px rgba(183,217,255,0.47);border-radius: 4px;font-size: 12px;margin-left: 16px;"
                @click="clickNotebookSet"
              >设置</el-button>
              <el-button v-show="notebookSet" style="width: 96px;height: 34px;" class="white-btn-hpj" @click="notebookCancelSet">取消</el-button>
<!--              :disabled="!notebookCanSave"-->
              <el-button
                v-show="notebookSet"
                type="primary"

                style="width: 96px;border-radius: 4px;font-size: 12px;margin-left: 16px;"
                @click="notebookSaveSet"
              >保存</el-button>
            </div>
          </div>
        </div>
        <!--中，下，表格和分页-->
        <div
          v-loading="loading"
          style="width: 100%;height: auto;"
        >
          <!--          height="calc(100% - 8px - 60px)"-->
          <!--          max-height="calc(100%)"-->
          <el-table
            v-if="activeTab==='模型' && userInfo.roleName !== '超级管理员'"
            :key="activeTab+tableKey + '0'"
            ref="modelTable"
            class="margin-top-8"
            style="width: 100%;border-radius: 2px;"
            border
            :height="modelList.length == 0 ? 60 + 45 : 500 < (modelList.length+1) * 45 ? 500 : (modelList.length+1) * 45"
            :data="modelList"
            :row-key="getRowKey"
            @sort-change="sortChange"
            @selection-change="handleSelectionChange"
            @mousedown.native="modelTableMouseDownHandler"
            @mouseup.native="modelTableMouseUpHandler"
            @mousemove.native="modelTableMouseMoveHandler"
          >
            <el-table-column type="selection" width="60" align="center" :reserve-selection="true" :selectable="modelSelectedAble" />
            <el-table-column label="序号" type="index" width="60" :index="indexMethod" />
            <el-table-column
              label="ID"
              align="left"
              prop="id"
              width="80"
              show-overflow-tooltip
              sortable="custom"
            />
            <el-table-column
              label="模型名称"
              align="left"
              prop="modelNameCh"
              show-overflow-tooltip
              min-width="200"
            >
              <template slot-scope="scope" class="flex justify-center align-center">
                <span
                  :class="[scope.row.status === 'ON_LINE' ? 'hover-to-blue' : '', scope.row.status === 'ON_LINE' ? 'hand' : '']"
                  style="font-weight: 400"
                  type="primary"
                  :underline="false"
                  @click="handleView(scope.row)"
                >{{ scope.row.modelNameCh }}</span>
              </template>
            </el-table-column>
            <el-table-column label="模型类型" align="left" prop="modelTypeName" show-overflow-tooltip width="120">
              <template slot="header">
                <TableFiltersPopover
                  :table-label="{
                    'type': 'modelType',
                    'label': '模型类型'
                  }"
                  :selection-list="filterModelTypeListAll"
                  :popover-width="'180'"
                  :key-props="{
                    'code': 'value',
                    'label': 'text'
                  }"
                  @filter="filterChange"
                />
              </template>
            </el-table-column>
            <el-table-column label="版本" align="left" prop="versionName" show-overflow-tooltip width="80" />
            <el-table-column
              label="发布时间"
              align="left"
              prop="onlineTime"
              show-overflow-tooltip
              min-width="100"
              sortable="custom"
            >
              <template slot-scope="scope" class="flex align-center" style="width: 100%;">
                <div class="flex align-center" style="width: 100%;">
                  <span v-if="scope.row.onlineTime">{{ scope.row.onlineTime && scope.row.onlineTime.split(' ')[0] }}</span>
                </div>
              </template>
            </el-table-column>
            <el-table-column
              v-if="userInfo.roleName !== '超级管理员'"
              label="授权时间"
              align="left"
              prop="sysUserModelData.createTime"
              show-overflow-tooltip
              width="160"
              sortable="custom"
            >
              <template slot-scope="scope" class="flex align-center" style="width: 100%;">
                <div class="flex align-center" style="width: 100%;">
                  <span v-if="scope.row.sysUserModelData">{{ scope.row.sysUserModelData.createTime }}</span>
                </div>
              </template>
            </el-table-column>
            <el-table-column
              v-if="userInfo.roleName !== '超级管理员'"
              label="服务开始时间"
              align="left"
              prop="sysUserModelData.expiryTimeStart"
              show-overflow-tooltip
              width="120"
            >
              <template slot-scope="scope" class="flex align-center" style="width: 100%;">
                <div class="flex align-center" style="width: 100%;">
                  <span v-if="scope.row.sysUserModelData">{{ scope.row.sysUserModelData.expiryTimeStart && scope.row.sysUserModelData.expiryTimeStart.split(' ')[0] }}</span>
                </div>
              </template>
            </el-table-column>
            <el-table-column
              v-if="userInfo.roleName !== '超级管理员'"
              label="服务到期时间"
              align="left"
              prop="sysUserModelData.expiryTimeEnd"
              show-overflow-tooltip
              width="120"
            >
              <template slot-scope="scope" class="flex align-center" style="width: 100%;">
                <div class="flex align-center" style="width: 100%;">
                  <span v-if="scope.row.sysUserModelData">{{ scope.row.sysUserModelData.expiryTimeEnd && scope.row.sysUserModelData.expiryTimeEnd.split(' ')[0] }}</span>
                </div>
              </template>
            </el-table-column>
            <el-table-column
              label="状态"
              align="left"
              prop="modelPermissionStatusEnum"
              show-overflow-tooltip
              width="100"
            >
              <template slot="header">
                <TableFiltersPopover
                  :table-label="{
                    'type': 'modelStatus',
                    'label': '状态'
                  }"
                  :selection-list="filterModelStatusListAll"
                  :popover-width="'140'"
                  :key-props="{
                    'code': 'value',
                    'label': 'text'
                  }"
                  @filter="filterChange"
                />
              </template>
              <template slot-scope="scope" class="color-content">
                <div v-if="scope.row.modelPermissionStatusEnum === 'ON_LINE'" class="flex align-center">
                  <div class="bgc-green round" style="width: 11px;height: 11px;margin-right: 4px;" />
                  <div>已上线</div>
                </div>
                <div v-if="scope.row.modelPermissionStatusEnum === 'OFF_LINE'" class="flex align-center">
                  <div class="round" style="width: 11px;height: 11px;margin-right: 4px;background-color: #8C8C8C;" />
                  <div>已下线</div>
                </div>
                <div v-if="scope.row.modelPermissionStatusEnum === 'EXPIRED'" class="flex align-center">
                  <div class="round" style="width: 11px;height: 11px;margin-right: 4px;background-color: #8C8C8C;" />
                  <div>已过期</div>
                </div>
              </template>
            </el-table-column>
            <el-table-column
              v-if="userInfo.roleName !== '超级管理员'"
              label="操作"
              align="center"
              prop="操作"
              show-overflow-tooltip
              width="90"
              fixed="right"
              class-name="table-operation-container"
            >
              <template slot-scope="scope" class="flex">
                <TableOperationTooltip icon-class="table-renewal" tooltip-title="续期" style="margin-right: 8px;" :icon-disabled="scope.row.permissionParam.mine==1" @tooltipClick="clickRenew(scope.row)" />
                <TableOperationTooltip icon-class="table-quxiaoshouquan" tooltip-title="取消授权" :icon-disabled="scope.row.permissionParam.mine==1" @tooltipClick="cancelAuthorization(scope.row)" />
              </template>
            </el-table-column>
          </el-table>
          <el-table
            v-if="activeTab==='模型' && userInfo.roleName === '超级管理员'"
            :key="activeTab+tableKey"
            ref="modelTable"
            class="margin-top-8"
            style="width: 100%;border-radius: 2px;"
            border
            :data="modelList"
            :height="modelList.length == 0 ? 60 + 45 : 500 < (modelList.length+1) * 45 ? 500 : (modelList.length+1) * 45"
            :row-key="getRowKey"
            @sort-change="sortChange"
            @selection-change="handleSelectionChange"
            @mousedown.native="modelTableMouseDownHandler"
            @mouseup.native="modelTableMouseUpHandler"
            @mousemove.native="modelTableMouseMoveHandler"
          >
            <el-table-column
              v-if="false"
              type="selection"
              width="60"
              align="center"
              :reserve-selection="true"
              :selectable="modelSelectedAble"
            />
            <el-table-column label="序号" type="index" align="center" width="60" :index="indexMethod" />
            <el-table-column
              label="ID"
              align="left"
              prop="id"
              width="80"
              show-overflow-tooltip
              sortable="custom"
            />
            <el-table-column
              label="模型名称"
              align="left"
              prop="modelNameCh"
              show-overflow-tooltip
              min-width="200"
            >
              <template slot-scope="scope" class="flex justify-center align-center">
                <span
                  :class="[scope.row.status === 'ON_LINE' ? 'hover-to-blue' : '', scope.row.status === 'ON_LINE' ? 'hand' : '']"
                  style="font-weight: 400"
                  type="primary"
                  :underline="false"
                  @click="handleView(scope.row)"
                >{{ scope.row.modelNameCh }}</span>
              </template>
            </el-table-column>
            <el-table-column label="模型类型" align="left" prop="modelTypeName" show-overflow-tooltip width="120">
              <template slot="header">
                <TableFiltersPopover
                  :table-label="{
                    'type': 'modelType',
                    'label': '模型类型'
                  }"
                  :selection-list="filterModelTypeListAll"
                  :popover-width="'180'"
                  :key-props="{
                    'code': 'value',
                    'label': 'text'
                  }"
                  @filter="filterChange"
                />
              </template>
            </el-table-column>
            <el-table-column label="版本" align="left" prop="versionName" show-overflow-tooltip width="80" />
            <el-table-column
              label="发布时间"
              align="left"
              prop="onlineTime"
              show-overflow-tooltip
              min-width="100"
              sortable="custom"
            >
              <template slot-scope="scope" class="flex align-center" style="width: 100%;">
                <div class="flex align-center" style="width: 100%;">
                  <span v-if="scope.row.onlineTime">{{ scope.row.onlineTime && scope.row.onlineTime.split(' ')[0] }}</span>
                </div>
              </template>
            </el-table-column>
            <el-table-column
              v-if="userInfo.roleName !== '超级管理员'"
              label="授权时间"
              align="left"
              prop="sysUserModelData.createTime"
              show-overflow-tooltip
              width="160"
              sortable="custom"
            >
              <template slot-scope="scope" class="flex align-center" style="width: 100%;">
                <div class="flex align-center" style="width: 100%;">
                  <span v-if="scope.row.sysUserModelData">{{ scope.row.sysUserModelData.createTime }}</span>
                </div>
              </template>
            </el-table-column>
            <el-table-column
              v-if="userInfo.roleName !== '超级管理员'"
              label="服务开始时间"
              align="left"
              prop="sysUserModelData.expiryTimeStart"
              show-overflow-tooltip
              width="120"
            >
              <template slot-scope="scope" class="flex align-center" style="width: 100%;">
                <div class="flex align-center" style="width: 100%;">
                  <span v-if="scope.row.sysUserModelData">{{ scope.row.sysUserModelData.expiryTimeStart && scope.row.sysUserModelData.expiryTimeStart.split(' ')[0] }}</span>
                </div>
              </template>
            </el-table-column>
            <el-table-column
              v-if="userInfo.roleName !== '超级管理员'"
              label="服务到期时间"
              align="left"
              prop="sysUserModelData.expiryTimeEnd"
              show-overflow-tooltip
              width="120"
            >
              <template slot-scope="scope" class="flex align-center" style="width: 100%;">
                <div class="flex align-center" style="width: 100%;">
                  <span v-if="scope.row.sysUserModelData">{{ scope.row.sysUserModelData.expiryTimeEnd && scope.row.sysUserModelData.expiryTimeEnd.split(' ')[0] }}</span>
                </div>
              </template>
            </el-table-column>
            <el-table-column
              label="状态"
              align="left"
              prop="modelPermissionStatusEnum"
              show-overflow-tooltip
              width="100"
            >
              <template slot="header">
                <TableFiltersPopover
                  :table-label="{
                    'type': 'modelStatus',
                    'label': '状态'
                  }"
                  :selection-list="filterModelStatusListAll"
                  :popover-width="'140'"
                  :key-props="{
                    'code': 'value',
                    'label': 'text'
                  }"
                  @filter="filterChange"
                />
              </template>
              <template slot-scope="scope" class="color-content">
                <div v-if="scope.row.modelPermissionStatusEnum === 'ON_LINE'" class="flex align-center">
                  <div class="bgc-green round" style="width: 11px;height: 11px;margin-right: 4px;" />
                  <div>已上线</div>
                </div>
                <div v-if="scope.row.modelPermissionStatusEnum === 'OFF_LINE'" class="flex align-center">
                  <div class="round" style="width: 11px;height: 11px;margin-right: 4px;background-color: #8C8C8C;" />
                  <div>已下线</div>
                </div>
                <div v-if="scope.row.modelPermissionStatusEnum === 'EXPIRED'" class="flex align-center">
                  <div class="round" style="width: 11px;height: 11px;margin-right: 4px;background-color: #8C8C8C;" />
                  <div>已过期</div>
                </div>
              </template>
            </el-table-column>
            <el-table-column
              v-if="userInfo.roleName !== '超级管理员'"
              label="操作"
              align="center"
              prop="操作"
              show-overflow-tooltip
              width="90"
              fixed="right"
              class-name="table-operation-container"
            >
              <template slot-scope="scope" class="flex">
                <TableOperationTooltip icon-class="table-renewal" tooltip-title="续期" style="margin-right: 8px;" :icon-disabled="scope.row.permissionParam.mine==1" @tooltipClick="clickRenew(scope.row)" />
                <TableOperationTooltip icon-class="table-quxiaoshouquan" tooltip-title="取消授权" :icon-disabled="scope.row.permissionParam.mine==1" @tooltipClick="cancelAuthorization(scope.row)" />
              </template>
            </el-table-column>
          </el-table>
          <el-table
            v-if="activeTab==='数据集'"
            :key="activeTab+tableKey"
            ref="dataSetTable"
            class="margin-top-8"
            style="width: 100%;border-radius: 2px;"
            border
            :height="dataSetList.length == 0 ? 60 + 45 : 500 < (dataSetList.length+1) * 45 ? 500 : (dataSetList.length+1) * 45"
            :data="dataSetList"
            :row-key="getRowKey"
            @filter-change="filterChange"
            @sort-change="sortChange"
            @selection-change="handleSelectionChange"
            @mousedown.native="dataSetTableMouseDownHandler"
            @mouseup.native="dataSetTableMouseUpHandler"
            @mousemove.native="dataSetTableMouseMoveHandler"
          >
            <el-table-column v-if="userInfo.roleName !== '超级管理员'" type="selection" width="60" :reserve-selection="true" :selectable="dataSetSelectedAble" />
            <el-table-column
              label="序号"
              align="left"
              type="index"
              width="60"
              show-overflow-tooltip
              :index="indexMethod"
            />
            <el-table-column
              label="ID"
              align="left"
              prop="id"
              width="80"
              show-overflow-tooltip
              sortable="custom"
            />
            <el-table-column
              label="数据集名称"
              align="left"
              prop="name"
              min-width="200"
              show-overflow-tooltip
            >
              <template slot-scope="scope" class="flex justify-center align-center">
                <span
                  :class="[scope.row.isOnline === 0 ? 'hover-to-blue' : '', scope.row.isOnline === 0 ? 'hand' : '']"
                  style="font-weight: 400"
                  type="primary"
                  :underline="false"
                  @click="handleView(scope.row)"
                >{{ scope.row.name }}</span>
              </template>
            </el-table-column>
            <el-table-column label="类型" align="left" prop="type" width="80" show-overflow-tooltip>
              <template slot="header">
                <TableFiltersPopover
                  :table-label="{
                    'type': 'datasetType',
                    'label': '类型'
                  }"
                  :selection-list="filterDataSetTypeListAll"
                  :popover-width="'140'"
                  :key-props="{
                    'code': 'value',
                    'label': 'text'
                  }"
                  @filter="filterChange"
                />
              </template>
              <template slot-scope="scope" class="flex align-center" style="width: 100%;">
                <div class="flex align-center color-content font-size-14">
                  <span v-if="scope.row.type === 'PICTURE'">图像</span>
                  <span v-if="scope.row.type === 'VOICE'">音频</span>
                  <span v-if="scope.row.type === 'TEXT'">文本</span>
                  <span v-if="scope.row.type === 'TABLE'">表格</span>
                  <span v-if="scope.row.type === 'VIDEO'">视频</span>
                </div>
              </template>
            </el-table-column>
            <el-table-column label="标注样本数/总数" align="left" prop="" width="140" show-overflow-tooltip>
              <template slot-scope="scope" class="flex align-center" style="width: 100%;">
                <div class="flex align-center color-content font-size-14">
                  <span><span class="color-blue">{{ scope.row.labeledNum }}</span>/{{ scope.row.taskNumber }}</span>
                </div>
              </template>
            </el-table-column>
            <el-table-column
              label="发布时间"
              align="left"
              prop="releaseTime"
              width="120"
              sortable="custom"
              show-overflow-tooltip
            >
              <template slot-scope="scope" class="flex align-center" style="width: 100%;">
                <div class="flex align-center" style="width: 100%;">
                  <span v-if="scope.row.releaseTime">{{ scope.row.releaseTime && scope.row.releaseTime.split(' ')[0] }}</span>
                </div>
              </template>
            </el-table-column>
            <el-table-column
              v-if="userInfo.roleName !== '超级管理员'"
              label="授权时间"
              align="left"
              prop="createTime"
              width="160"
              sortable="custom"
              show-overflow-tooltip
            >
              <template slot-scope="scope" class="flex align-center" style="width: 100%;">
                <div class="flex align-center" style="width: 100%;">
                  <span v-if="scope.row.judgePermission">{{ scope.row.judgePermission.createTime }}</span>
                </div>
              </template>
            </el-table-column>
            <el-table-column
              label="状态"
              align="left"
              prop="isOnline"
              show-overflow-tooltip
              width="100"
            >
              <template slot="header">
                <TableFiltersPopover
                  :table-label="{
                    'type': 'datasetStatus',
                    'label': '状态'
                  }"
                  :selection-list="filterDataSetStatusListAll"
                  :popover-width="'140'"
                  :key-props="{
                    'code': 'value',
                    'label': 'text'
                  }"
                  @filter="filterChange"
                />
              </template>
              <template slot-scope="scope" class="color-content">
                <div v-if="scope.row.isOnline == 0" class="flex align-center">
                  <div class="bgc-green round" style="width: 11px;height: 11px;margin-right: 4px;" />
                  <div>已上线</div>
                </div>
                <div v-if="scope.row.isOnline == 1" class="flex align-center">
                  <div class="round" style="width: 11px;height: 11px;margin-right: 4px;background-color: #8C8C8C;" />
                  <div>已下线</div>
                </div>
              </template>
            </el-table-column>
            <el-table-column
              v-if="userInfo.roleName !== '超级管理员'"
              label="操作"
              align="center"
              prop="操作"
              width="60"
              fixed="right"
              show-overflow-tooltip
              class-name="table-operation-container"
            >
              <template slot-scope="scope" class="flex">
                <TableOperationTooltip icon-class="table-quxiaoshouquan" tooltip-title="取消授权" :icon-disabled="scope.row.mine==1" @tooltipClick="cancelAuthorization(scope.row)" />
              </template>
            </el-table-column>
          </el-table>
          <el-table v-if="activeTabIsNotebook"
                    id="id333"
                    :key="activeTab"
                    class="margin-top-8"
                    style="width: 100%;border-radius: 2px;"
                    border
                    :data="notebookSetList"
          >
            <el-table-column label="类型" align="left" prop="name" min-width="100"></el-table-column>
            <el-table-column label="资源配置值" align="left" prop="total" min-width="100">
              <template slot-scope="scope">
                <div class="flex font-size-14 color-content" style="width: 100%;">
                  <div v-show="!notebookSet">
                    <div v-if="scope.row.name==='GPU(卡数)'">{{scope.row.total}}</div>
                    <div v-else>{{Number(scope.row.total).toFixed(1)}}</div>
                  </div>
                  <div v-show="notebookSet" style="width: 100%;">
<!--                    <el-input-number v-if="scope.row.name==='CPU(核数)'" v-model="notebookNewNumber.cpu" :step="0.1" :precision="1" :controls="false" :min="0"></el-input-number>-->
<!--                    <el-input-number v-else-if="scope.row.name==='Memory(Gi)'" v-model="notebookNewNumber.memory" :step="0.1" :precision="1" :controls="false" :min="0"></el-input-number>-->
<!--                    <el-input-number v-else-if="scope.row.name==='GPU(卡数)'" v-model="notebookNewNumber.gpu" :step="1" :precision="0" :controls="false" :min="0"></el-input-number>-->
                    <el-input v-if="scope.row.name==='CPU(核数)'" v-model="notebookNewNumber.cpu" @change="changeCpu"/>
                    <el-input v-if="scope.row.name==='Memory(Gi)'" v-model="notebookNewNumber.memory" @change="changeMemory"/>
                    <el-input v-if="scope.row.name==='GPU(卡数)'" v-model="notebookNewNumber.gpu" @change="changeGpu"/>
                  </div>
                </div>
              </template>
            </el-table-column>
            <el-table-column label="资源占用情况" align="left" prop="use" min-width="100">
              <template slot-scope="scope">
                <div class="flex align-center" style="width: 100%;">
                  <div class="flex align-center font-size-14 color-content" style="width: 64px;">{{Number(scope.row.total)!=0?Number(scope.row.use/scope.row.total*100).toFixed(2):'0.00'}}%</div>
                  <div class="margin-left-8" style="height: 14px;width: calc(100% - 64px);">
                    <el-progress color="#0164FF" :show-text="false" :stroke-width="12" :percentage="Number(scope.row.total)!=0?Number(Number(scope.row.use/scope.row.total*100).toFixed(2)):0"></el-progress>
                  </div>
                </div>
              </template>
            </el-table-column>
          </el-table>
          <!--下,分页-->
          <div
            v-if="!activeTabIsNotebook && pageItemTotal > pageSize"
            class="flex justify-center align-center"
            style="width: 100%;height: 60px;min-height: 60px;"
          >
            <el-pagination
              background
              :page-size="pageSize"
              layout="total,prev, pager, next,sizes,jumper"
              :page-sizes="[10,20,30,40]"
              :current-page="currentPage"
              :total="pageItemTotal"
              @size-change="handleSizeChange"
              @current-change="handleCurrentChange"
            />
          </div>
        </div>
      </div>
    </div>
    <!--重置密码弹框-->
    <reset-password
      v-if="showResetPasswordDialog"
      :form="userInfo"
      @ok="resetPasswordDialogOk"
      @cancel="resetPasswordDialogCancel"
    />
    <!--设置期限弹框-->
    <set-time-dialog
      v-if="showSetTimeDialog"
      :begin-date="userInfo.beginDate"
      :end-date="userInfo.endDate"
      @ok="setTimeDialogOk"
      @cancel="setTimeDialogCancel"
    />
    <!--取消授权弹框-->
    <cancel-authorization
      v-if="showCancelAuthorizationDialog"
      :form="selectedData"
      :type="activeTab"
      @ok="cancelAuthorizationDialogOk"
      @cancel="cancelAuthorizationDialogCancel"
    />
    <!--批量取消授权弹框-->
    <batch-cancel-authorization
      v-if="showBatchCancelAuthorizationDialog"
      :number="selectedDataList.length"
      :type="activeTab"
      @ok="batchCancelAuthorizationDialogOk"
      @cancel="batchCancelAuthorizationDialogCancel"
    />
    <!--授权弹框-->
    <authorize-dialog
      v-if="showAuthorizeDialog"
      :active-tab="JSON.parse(JSON.stringify(activeTab))"
      :user-id="$route.params.id+''"
      :filter-model-type-list-all="filterModelTypeListAll"
      :filter-model-status-list-all="filterModelStatusListAll"
      :filter-data-set-type-list-all="filterDataSetTypeListAll"
      :filter-data-set-status-list-all="filterDataSetStatusListAll"
      @ok="authorizeDialogOk"
      @cancel="authorizeDialogCancel"
    />
    <!--修改用户信息弹框-->
    <change-user-info
      v-if="showChangeUserInfoDialog"
      :user-info="userInfo"
      :role-list="roleList"
      @ok="changeUserInfoOk"
      @cancel="changeUserInfoCancel"
    />
    <!--续期弹框-->
    <renew-dialog
      v-if="showRenewDialog"
      :user-name="userInfo.userName"
      :before-start-time="selectedData.sysUserModelData.expiryTimeStart.split(' ')[0]"
      :before-end-time="selectedData.sysUserModelData.expiryTimeEnd.split(' ')[0]"
      @ok="renewDialogOk"
      @cancel="renewDialogCancel"
    />
    <!--信息提示弹框-->
    <message-dialog
      v-if="showMessageDialog"
      @save="messageDialogOk"
      @cancel="messageDialogCancel"
    >
      <template slot="content">
        <div class="content-container" style="text-align: left;" v-html="dialogContent" />
      </template>
    </message-dialog>
  </div>
</template>

<script>
import TitleStyle from '@/components/TitleStyle';
import InputWithSearch from '@/components/InputWithSearch';
import CancelAuthorization from '@/views/permission-management/user-management/components/CancelAuthorization';
import ResetPassword from '@/views/permission-management/user-management/components/ResetPassword';
import SetTimeDialog from '@/views/permission-management/user-management/components/SetTimeDialog';
import AuthorizeDialog from '@/views/permission-management/user-management/components/AuthorizeDialog';
import HpjTabs from '@/components/hpj/HpjTabs';
import ChangeUserInfo from '@/views/permission-management/user-management/components/ChangeUserInfo';
import RenewDialog from '@/views/permission-management/user-management/components/RenewDialog';
import TableFiltersPopover from '@/components/TableFiltersPopover';
import TableOperationTooltip from '@/components/TableOperationTooltip';
import MessageDialog from "@/views/data-manager/dataSet/components/MessageDialog";
import {
  batchDataSetAuthorize,
  batchModelAuthorize,
  batchSetUserTime,
  cancelAuthorize,
  getRoleList,
  getUserById,
  modelRenew,
  putProfile,
  resetPassword,
  permissionModelList,
  permissionDatasetList, getNotebookConfByUserId, changeNotebookConf,
} from '@/api/user';
import qs from 'qs';
import { getModelClassification } from '@/api/model';
import { parseTime } from '@/utils';
import BatchCancelAuthorization
from '@/views/permission-management/user-management/components/BatchCancelAuthorization';
export default {
  name: 'Detail',
  components: {
    BatchCancelAuthorization,
    RenewDialog,
    ChangeUserInfo,
    ResetPassword,
    CancelAuthorization,
    TitleStyle,
    InputWithSearch,
    SetTimeDialog,
    AuthorizeDialog,
    HpjTabs,
    TableFiltersPopover,
    TableOperationTooltip,
    MessageDialog,
  },
  data() {
    return {
      // 用户信息
      userInfo: {},
      roleList: [], // 角色列表

      // 弹框
      showResetPasswordDialog: false,
      showCancelAuthorizationDialog: false,
      showBatchCancelAuthorizationDialog: false,
      showSetTimeDialog: false,
      showAuthorizeDialog: false,
      showChangeUserInfoDialog: false,
      showRenewDialog: false,
      showMessageDialog:false,

      // tab
      tabList: ['模型', '数据集','Notebooks资源配置'],
      activeTab: '模型', // model dataSet
      notebookSet:false,//notebook是否是设置状态

      // 模型
      modelNum: 0,
      modelList: [],
      filterModelTypeListAll: [], // 模型类型筛选全部
      filterModelTypeList: [], // 模型类型筛选
      filterModelStatusListAll: [
        { text: '已下线', value: 'OFF_LINE' },
        { text: '已上线', value: 'ON_LINE' },
        { text: '已过期', value: 'EXPIRED' }
      ], // 模型状态全部
      filterModelStatusList: [],
      // 数据集
      dataSetNum: 0,
      dataSetList: [],
      selectedData: {}, // 选择的单个数据
      selectedDataList: [], // 通过复选框选择的多个数据
      filterDataSetTypeListAll: [
        { text: '图像', value: 'PICTURE' },
        { text: '音频', value: 'VOICE' },
        { text: '文本', value: 'TEXT' },
        { text: '表格', value: 'TABLE' },
        { text: '视频', value: 'VIDEO' }
      ], // 数据集类型筛选全部
      filterDataSetTypeList: [], // 数据集类型筛选
      filterDataSetStatusListAll: [
        { text: '已下线', value: '1' },
        { text: '已上线', value: '0' }
      ], // 模型状态全部
      filterDataSetStatusList: [],

      //notebook相关
      notebookSetList:[],
      notebookNewNumber:{
        cpu:0,
        cpuUse:0,
        memory:0,
        memoryUse:0,
        gpu:0,
        gpuUse:0,
      },
      dialogContent:'',

      // 分页相关
      loading: false, // 加载中
      keyword: '', // 搜索框
      pageItemTotal: 0, // 列表总数
      pageSize: 10, // 每页条数
      currentPage: 1, // 当前页码
      sortColumn: '', // 排序的列名
      sortOrder: '', // 排序方式

      // 刷新table
      tableKey: new Date(),
      modelTableMouseFlag: false,
      modelTableMouseOffset: 0,
      dataSetTableMouseFlag: false,
      dataSetTableMouseOffset: 0
    };
  },
  computed: {
    userId: {
      get() {
        return this.$route.params.id;
      }
    },
    activeTabIsNotebook(){
      return this.activeTab === 'Notebooks资源配置'
    },
    notebookCanSave(){
      return this.changeCpu(false) && this.changeMemory(false) && this.changeGpu(false)
    }
  },
  created() {
    this.getModelClassification();
    this.getRoleList();
    this.getUserInfo();
    this.getModelAndDataSetNum();
    this.getList()
  },
  methods: {
    // 表格鼠标按下滚动 开始
    // 按下鼠标记录鼠标位置
    modelTableMouseDownHandler(e) {
      this.modelTableMouseOffset = e.clientX;
      this.modelTableMouseFlag = true;
    },
    modelTableMouseUpHandler(e) {
      this.modelTableMouseFlag = false;
    },
    modelTableMouseMoveHandler(e) {
      // 这里面需要注意，通过ref需要那个包含table元素的父元素
      if (!this.$refs.modelTable) return;
      const divData = this.$refs.modelTable.bodyWrapper;
      if (this.modelTableMouseFlag) {
        // 设置水平方向的元素的位置
        divData.scrollLeft -= (-this.modelTableMouseOffset + (this.modelTableMouseOffset = e.clientX));
      }
    },
    // 按下鼠标记录鼠标位置
    dataSetTableMouseDownHandler(e) {
      this.dataSetTableMouseOffset = e.clientX;
      this.dataSetTableMouseFlag = true;
    },
    dataSetTableMouseUpHandler(e) {
      this.dataSetTableMouseFlag = false;
    },
    dataSetTableMouseMoveHandler(e) {
      // 这里面需要注意，通过ref需要那个包含table元素的父元素
      if (!this.$refs.dataSetTable) return;
      const divData = this.$refs.dataSetTable.bodyWrapper;
      if (this.dataSetTableMouseFlag) {
        // 设置水平方向的元素的位置
        divData.scrollLeft -= (-this.dataSetTableMouseOffset + (this.dataSetTableMouseOffset = e.clientX));
      }
    },
    // 表格鼠标按下滚动 结束
    // 获取已授权模型和数据集数量
    getModelAndDataSetNum() {
      // 获取模型数量
      this.loading = true;
      const params1 = {
        keyword: '',
        modelTypeId: '',
        pageNum: 1,
        pageSize: 10,
        userId: this.$route.params.id,
        tag: 4
      };
      permissionModelList(params1).then(res => {
        this.modelNum = res.data.total;
        this.loading = false;
      });
      const params2 = {
        'name': '',
        'pageNum': 1,
        'pageSize': 10,
        'typeList': [],
        'applyUserId': this.$route.params.id,
        'tag': 3
      };
      permissionDatasetList(params2).then(res => {
        this.dataSetNum = res.data.total;
        this.loading = false;
      });
    },
    search(keyword) {
      this.keyword = keyword;
      this.currentPage = 1;
      this.getList();
    },
    // 保存选中的数据id,row-key就是要指定一个key标识这一行的数据
    getRowKey(row) {
      return row.id;
    },
    handleSelectionChange(selectedList) {
      this.selectedDataList = selectedList;
    },
    // 表格项是否可以勾选
    modelSelectedAble(row, index) {
      return row.permissionParam.mine !== 1 && row.permissionParam.mine !== '1';
    },
    dataSetSelectedAble(row, index) {
      return row.mine !== 1 && row.mine !== '1';
    },
    // 获取角色列表
    getRoleList() {
      getRoleList().then(res => {
        const data = res.data;
        this.roleList = data;
        for (let i = 0; i < this.roleList.length; i++) {
          this.roleList[i].text = this.roleList[i].roleName;
          this.roleList[i].value = this.roleList[i].roleKey;
        }
      });
    },
    // get模型筛选列表
    getModelClassification() {
      getModelClassification().then(res => {
        const data = res.data;
        for (let i = 0; i < data.length; i++) {
          const params = {
            text: data[i].typeName,
            value: data[i].id
          };
          this.filterModelTypeListAll.push(params);
        }
      });
    },
    async getUserInfo() {
      const params = {
        userId: this.$route.params.id
      };
      await getUserById(params).then(res => {
        this.userInfo = res.data;
        if (this.userInfo.roleName !== '超级管理员') {
          this.filterModelStatusListAll = [
            { text: '已下线', value: 'OFF_LINE' },
            { text: '已上线', value: 'ON_LINE' },
            { text: '已过期', value: 'EXPIRED' }
          ];
        } else {
          this.filterModelStatusListAll = [
            { text: '已下线', value: 'OFF_LINE' },
            { text: '已上线', value: 'ON_LINE' }
          ];
        }
      });
    },
    goBack() {
      this.$router.back();
    },
    // 切换面板
    changeActiveTab(activeTab) {
      this.activeTab = activeTab;
      if(this.activeTab=='模型' || this.activeTab=='数据集'){
        this.initParams();
        this.getList();
      }else if(this.activeTab=='Notebooks资源配置'){//notebooks资源配置
        this.getNotebookConfByUserId()
      }
    },
    initParams() {
      this.keyword = '';
      this.pageSize = 10;
      this.currentPage = 1;
      this.sortColumn = '';
      this.sortOrder = '';
      this.modelTypeId = '';
      this.filterModelTypeList = [];
      this.filterModelStatusList = [];
      this.filterDataSetTypeList = [];
      this.filterDataSetStatusList = [];
      this.selectedData = null;
      this.selectedDataList = [];
    },
    getList() {
      // this.pageItemTotal = 0;
      if (this.activeTab === '模型') {
        this.getModelList();
      } else if (this.activeTab === '数据集') {
        this.getDataSetList();
      }
    },
    // 获取模型列表
    getModelList() {
      this.loading = true;
      const params = {
        keyword: this.keyword,
        modelTypeIdList: this.filterModelTypeList,
        modelPermissionStatusEnums: this.filterModelStatusList,
        pageNum: this.currentPage,
        pageSize: this.pageSize,
        userId: this.$route.params.id,
        tag: 4,
        column: this.sortColumn,
        order: this.sortOrder
      };
      permissionModelList(params).then(res => {
        this.modelList = res.data.records;
        this.pageItemTotal = res.data.total;
        this.$nextTick(() => {
          this.$refs.modelTable.bodyWrapper.scrollTop = 0;
        });
        this.loading = false;
      });
    },
    // 获取数据集列表
    getDataSetList() {
      this.loading = true;
      const params = {
        'name': this.keyword,
        'pageNum': this.currentPage,
        'pageSize': this.pageSize,
        'typeList': this.filterDataSetTypeList,
        'statusList': this.filterDataSetStatusList,
        'applyUserId': this.$route.params.id,
        'tag': 3,
        'column': this.sortColumn,
        'order': this.sortOrder
      };
      permissionDatasetList(params).then(res => {
        this.dataSetList = res.data.records;
        // 设置分页
        console.warn('设置dataset分页')
        this.pageItemTotal = res.data.total;
        this.$nextTick(() => {
          this.$refs.dataSetTable.bodyWrapper.scrollTop = 0;
        });
        this.loading = false;
      });
    },
    sortChange({ column, prop, order }) {
      if (prop === 'sysUserModelData.createTime') {
        this.sortColumn = prop.split('.')[1];
      } else {
        this.sortColumn = prop;
      }
      this.sortOrder = order;
      this.$refs.modelTable?.clearSelection();
      this.$refs.dataSetTable?.clearSelection();
      this.getList();
    },
    // 过滤
    filterChange(type, list) {
      this.currentPage = 1;
      this.pageSize = 10;
      if (type === 'modelType') {
        this.filterModelTypeList = list;
      } else if (type === 'modelStatus') {
        this.filterModelStatusList = list;
      } else if (type === 'datasetType') {
        this.filterDataSetTypeList = list;
      } else if (type === 'datasetStatus') {
        this.filterDataSetStatusList = list;
      }
      if (this.activeTab === '模型') {
        this.$refs.modelTable?.clearSelection();
      } else if (this.activeTab === '数据集') {
        this.$refs.dataSetTable?.clearSelection();
      }
      this.getList();
    },
    /** 查看按钮操作 **/
    handleView(item) {
      if (this.activeTab === '模型') {
        if (item.status !== 'ON_LINE') return;
        const endIndex = this.findNCharAtString(location.href, '/', 2);
        item['permissionParam']['status'] = item.status;
        sessionStorage.setItem('permissionParam', JSON.stringify(item.permissionParam));
        window.open(location.href.substring(0, endIndex + 1) + 'model-base/user-model-detail/' + item.id);
      } else if (this.activeTab === '数据集') {
        if (item.isOnline === 1) return;
        sessionStorage.setItem('isShowLabelView', true);
        sessionStorage.setItem('isShowForkButton', false);
        const { href } = this.$router.resolve({
          path: `/data-manager/data-set/common-detail/blank/${item.id}/common`
        });
        window.open(href);
      }
    },
    findNCharAtString(str, cha, num) {
      var x = str.indexOf(cha);
      for (var i = 0; i < num; i++) {
        x = str.indexOf(cha, x + 1);
      }
      return x;
    },
    handleSizeChange(val) {
      this.pageSize = val;
      this.currentPage = 1;
      this.getList();
    },
    handleCurrentChange(val) {
      this.currentPage = val;
      this.getList();
    },
    // 点击取消授权
    cancelAuthorization(form) {
      if (this.activeTab === '模型') {
        if (form.permissionParam.mine === 1 || form.permissionParam.mine === '1') return;
      } else if (this.activeTab === '数据集') {
        if (form.mine === 1 || form.mine === '1') return;
      }
      this.selectedData = form;
      this.showCancelAuthorizationDialog = true;
    },
    // 取消授权弹框ok
    cancelAuthorizationDialogOk() {
      this.cancelAuthorizationDialogCancel();
      let id = '';
      if (this.activeTab === '模型') {
        id = this.selectedData.sysUserModelData.id;
      } else if (this.activeTab === '数据集') {
        id = this.selectedData.judgePermission.id;
      }
      cancelAuthorize(id).then(res => {
        const data = res.data;
        if (data === true) {
          this.$message({
            type: 'success',
            message: '取消授权成功!'
          });
          if (this.activeTab === '模型') {
            this.$refs.modelTable?.clearSelection();
          } else if (this.activeTab === '数据集') {
            this.$refs.dataSetTable?.clearSelection();
          }
        } else {
          this.$message({
            type: 'error',
            message: '取消授权失败'
          });
        }
        this.getModelAndDataSetNum();
        this.getList();
      });
    },
    // 取消授权弹框cancel
    cancelAuthorizationDialogCancel() {
      this.showCancelAuthorizationDialog = false;
    },
    // 点击批量取消授权
    batchCancelAuthorization() {
      this.showBatchCancelAuthorizationDialog = true;
    },
    // 批量取消授权弹框ok
    batchCancelAuthorizationDialogOk() {
      if (this.activeTab === '模型') {
        const params = {
          cancelFunctionIds: [],
          userId: this.userId
        };
        for (let i = 0; i < this.selectedDataList.length; i++) {
          params.cancelFunctionIds.push(this.selectedDataList[i].id);
        }
        batchModelAuthorize(params).then(res => {
          if (res.desc === 'success') {
            this.$message({
              type: 'success',
              message: '成功取消授权' + this.selectedDataList.length + '个模型'
            });
          } else {
            this.$message({
              type: 'error',
              message: '取消授权' + this.selectedDataList.length + '个模型失败'
            });
          }
          // 更新tableKey值，强制刷新table组件，防止row-key保留之前的状态
          this.tableKey = new Date();
          this.selectedDataList = [];
          this.getModelAndDataSetNum();
          this.initParams();
          this.getList();
        });
      } else if (this.activeTab === '数据集') {
        const params = {
          cancelFunctionIds: [],
          userId: this.userId
        };
        for (let i = 0; i < this.selectedDataList.length; i++) {
          params.cancelFunctionIds.push(this.selectedDataList[i].id);
        }
        batchDataSetAuthorize(params).then(res => {
          if (res.desc === 'success') {
            this.$message({
              type: 'success',
              message: '成功取消授权' + this.selectedDataList.length + '个数据集'
            });
          } else {
            this.$message({
              type: 'error',
              message: '取消授权' + this.selectedDataList.length + '个数据集失败'
            });
          }
          // 更新tableKey值，强制刷新table组件，防止row-key保留之前的状态
          this.tableKey = new Date();
          this.selectedDataList = [];
          this.getModelAndDataSetNum();
          this.initParams();
          this.getList();
        });
      }
      this.batchCancelAuthorizationDialogCancel();
    },
    // 批量取消授权弹框cancel
    batchCancelAuthorizationDialogCancel() {
      this.showBatchCancelAuthorizationDialog = false;
    },
    // 重置密码
    async resetPasswordDialogOk() {
      const params = {
        userId: this.userInfo.userId
      };
      await resetPassword(qs.stringify(params)).then(res => {
        if (res.desc === 'success') {
          this.$message({
            type: 'success',
            message: '重置密码成功，新密码为' + res.data
          });
        } else {
          this.$message({
            type: 'error',
            message: '重置密码失败'
          });
        }
      });
      this.getUserInfo();
      this.resetPasswordDialogCancel();
    },
    resetPasswordDialogCancel() {
      this.showResetPasswordDialog = false;
    },
    // 设置期限
    async setTimeDialogOk(object) {
      const params = {
        limit: {}
      };
      const limit = Object.assign({}, object);
      limit.userIds = [];
      limit.userIds.push(this.userInfo.userId);
      params.limit = limit;
      await batchSetUserTime(params.limit).then(res => {
        if (res.data) {
          this.$message({
            type: 'success',
            message: '设置期限成功'
          });
        } else {
          this.$message({
            type: 'error',
            message: '设置期限失败'
          });
        }
      });
      this.setTimeDialogCancel();
      this.getUserInfo();
    },
    setTimeDialogCancel() {
      this.showSetTimeDialog = false;
    },
    authorizeDialogOk() {
      if (this.activeTab === '模型') {
        this.$refs.modelTable?.clearSelection();
      } else if (this.activeTab === '数据集') {
        this.$refs.dataSetTable?.clearSelection();
      }
      this.getModelAndDataSetNum();
      this.initParams();
      this.getList();
      this.authorizeDialogCancel();
    },
    authorizeDialogCancel() {
      this.showAuthorizeDialog = false;
    },
    // 修改用户信息
    changeUserInfoOk(params) {
      this.changeUserInfoCancel();
      putProfile(params).then((res) => {
        if (res.code === '000000') {
          this.$message.success('修改成功');
          this.getUserInfo();
        }
      });
    },
    changeUserInfoCancel() {
      this.showChangeUserInfoDialog = false;
    },
    clickRenew(row) {
      if (row.permissionParam.mine === 1 || row.permissionParam.mine === '1') return;
      this.selectedData = JSON.parse(JSON.stringify(row));
      this.showRenewDialog = true;
    },
    renewDialogOk(renewTime) {
      this.renewDialogCancel();
      if (renewTime == null) {
        return;
      }
      const params = {
        'expiryTimeStart': parseTime(renewTime[0]),
        'expiryTimeEnd': parseTime(renewTime[1]),
        'id': this.selectedData.sysUserModelData.id
      };
      modelRenew(params).then(res => {
        if (res.data) {
          this.$message({
            type: 'success',
            message: '续期成功'
          });
        } else {
          this.$message({
            type: 'error',
            message: '续期失败'
          });
        }
        this.getList();
      });
    },
    renewDialogCancel() {
      this.showRenewDialog = false;
    },
    indexMethod(index) {
      return (this.currentPage - 1) * this.pageSize + index + 1;
    },
    //点击notebook设置按钮
    clickNotebookSet(){
      this.notebookNewNumber.cpu = Number(this.notebookSetList[0].total)
      this.notebookNewNumber.cpuUse = Number(this.notebookSetList[0].use)
      this.notebookNewNumber.memory = Number(this.notebookSetList[1].total)
      this.notebookNewNumber.memoryUse = Number(this.notebookSetList[1].use)
      this.notebookNewNumber.gpu = Number(this.notebookSetList[2].total)
      this.notebookNewNumber.gpuUse = Number(this.notebookSetList[2].use)
      this.notebookSet = true
    },
    //notebook查询接口
    getNotebookConfByUserId(){
      this.loading = true
      let params = {
        userId:this.userId,
      }
      getNotebookConfByUserId(qs.stringify(params)).then(res => {
        let data = res.data
        this.notebookSetList = []
        let data1 = {
          name:'CPU(核数)',
          total:Number(data.cpu.total),
          use:Number(data.cpu.use),
        }
        let data2 ={
          name:'Memory(Gi)',
          total:Number(data.memory.total),
          use:Number(data.memory.use),
        }
        let data3 = {
          name:'GPU(卡数)',
          total:Number(data.gpu.total),
          use:Number(data.gpu.use),
        }
        this.notebookSetList.push(data1)
        this.notebookSetList.push(data2)
        this.notebookSetList.push(data3)
        this.loading = false
      })
    },
    //notebook设置时点击取消
    notebookCancelSet(){
      this.notebookSet = false
    },
    //notebook设置时点击保存CPU(核数)
    notebookSaveSet(){
      let ok = this.changeCpu() && this.changeMemory() && this.changeGpu()
      if(!ok){
        return
      }
      let params = {
        userId:this.userId
      }
      Object.assign(params,this.notebookNewNumber)
      this.loading = true
      changeNotebookConf(params).then(res => {
        if(res.code == '000000'){//成功
          this.$message({
            type:'success',
            message:'保存成功',
          })
        }else {//失败
          // this.$message({
          //   type:'error',
          //   message:'保存失败',
          // })
          //新逻辑
          // let text = ''
          // if(!res.data.cpu.enought){
          //   text += 'CPU剩余'+res.data.cpu.number+'核，'
          // }
          // if(!res.data.gpu.enought){
          //   text += 'GPU剩余'+res.data.gpu.number+'卡数，'
          // }
          // if(!res.data.memory.enought){
          //   text += 'Memory剩余'+res.data.memory.number+'Gi，'
          // }
          // this.dialogContent = '<span style="text-align: left;">资源不足，<span class="color-blue">' + text + ' </span>请重新设置。</span>'
          // this.showMessageDialog = true
        }
        console.log('hhhhhhhhh')
        this.loading = false
        this.notebookSet = false
        this.getNotebookConfByUserId()
      })
    },
    //notebook失败弹框点击确定
    messageDialogOk(){
      this.messageDialogCancel()
    },
    //notebook失败弹框点击取消
    messageDialogCancel(){
      this.showMessageDialog = false
    },
    isNumber(value){
      return /^\d+(\.\d+)?$/.test(value);
    },
    changeCpu(showMessage = true) {
      if(!this.isNumber(this.notebookNewNumber.cpu)){
        if(showMessage){
          this.$message({
            message: 'CPU数量为正数',
            type: 'warning'
          });
        }
        return false;
      }
      this.notebookNewNumber.cpu = Number(Number(this.notebookNewNumber.cpu).toFixed(1))
      if(this.notebookNewNumber.cpu<this.notebookNewNumber.cpuUse){
        if(showMessage){
          this.$message({
            type:'warning',
            message:'CPU数量大于等于CPU已使用数量'+this.notebookNewNumber.cpuUse,
          })
          // this.notebookNewNumber.cpu = this.notebookNewNumber.cpuUse
        }
        return false;
      }
      if(this.notebookNewNumber.cpu > 40){
        if(showMessage){
          this.$message({
            type:'warning',
            message:'CPU数量小于等于40',
          })
          // this.notebookNewNumber.cpu = 40
        }
        return false;
      }
      return true
    },
    changeMemory(showMessage = true) {
      if(!this.isNumber(this.notebookNewNumber.memory)){
        if(showMessage){
          this.$message({
            message: 'Memory数量为正数',
            type: 'warning'
          });
        }
        return false;
      }
      this.notebookNewNumber.memory = Number(Number(this.notebookNewNumber.memory).toFixed(1))
      if(this.notebookNewNumber.memory<this.notebookNewNumber.memoryUse){
        if(showMessage){
          this.$message({
            type:'warning',
            message:'Memory数量大于等于Memory已使用数量'+this.notebookNewNumber.memoryUse
          })
          // this.notebookNewNumber.memory = this.notebookNewNumber.memoryUse
        }
        return false;
      }
      if(this.notebookNewNumber.memory > 40){
        if(showMessage){
          this.$message({
            type:'warning',
            message:'Memory数量小于等于40',
          })
          // this.notebookNewNumber.memory = 40
        }
        return false;
      }
      return true;
    },
    changeGpu(showMessage = true){
      if(!this.isNumber(this.notebookNewNumber.gpu)){
        if(showMessage){
          this.$message({
            message: 'GPU数量为正数',
            type: 'warning'
          });
        }
        return false;
      }
      this.notebookNewNumber.gpu = Number(Number(this.notebookNewNumber.gpu).toFixed(0))
      if(this.notebookNewNumber.gpu<this.notebookNewNumber.gpuUse){
        if(showMessage){
          this.$message({
            type:'warning',
            message:'GPU数量大于等于GPU已使用数量'+this.notebookNewNumber.gpuUse
          })
          // this.notebookNewNumber.gpu = this.notebookNewNumber.gpuUse
        }
        return false;
      }
      if(this.notebookNewNumber.gpu > 0){
        if(showMessage){
          this.$message({
            type:'warning',
            message:'GPU数量小于等于0',
          })
          // this.notebookNewNumber.gpu = 0
        }
        return false;
      }
      return true;
    },

  }
};
</script>

<style lang="scss" scoped>


.id232 {
  ::v-deep {
    .el-tabs__item {
      color: #323232;
      width: 105px;
      border: none;
      text-align: center;
      height: 32px;
      line-height: 32px;
      border-radius: 4px 4px 0 0;
      &.is-active {
        color: #0164FF;
        &::before {
          content: " ";
          width: 105px;
          height: 2px;
          background: #0164FF;
          display: inline-block;
          position: absolute;
          left: 1px;
          top: 1px;
        }
      }
      .name-container {
        display: inline-block;
      }
    }
    .el-form--inline .el-form-item{
      margin-right: 0px;
    }
    .el-form-item{
      margin-bottom: 0px!important;
    }
    label {
      font-weight: 400;
    }
    .el-input--medium .el-input__inner{
      height: 32px;
      line-height: 32px;
    }
    .el-progress-bar__outer{
      background-color: #F4F4F4!important;
    }
  }
  .el-form-item__label {
    font-weight: 400;
  }

}
#id333{
  ::v-deep{
    .el-input--medium .el-input__inner{
      height: 23px;
      line-height: 23px;
    }
    .el-input-number--medium{
      height: 23px;
      line-height: 23px;
      width: 100%;
    }
    //.cell{
    //  height: 45px;
    //}
  }
}
.content-container{
  padding: 0!important;
}
</style>

