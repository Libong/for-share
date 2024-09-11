<script lang="ts" setup>

import {onMounted} from "vue";


onMounted(()=>{
  let modeSwitch = document.querySelector('.mode-switch');
  if (modeSwitch == null) {
    return;
  }
  modeSwitch.addEventListener('click', function () {
    document.documentElement.classList.toggle('dark');
    modeSwitch.classList.toggle('active');
  });

  let listView = document.querySelector('.list-view');
  let gridView = document.querySelector('.grid-view');
  let projectsList = document.querySelector('.project-boxes');
  if (listView == null || gridView == null || projectsList == null) {
    return;
  }
  listView.addEventListener('click', function () {
    gridView.classList.remove('active');
    listView.classList.add('active');
    projectsList.classList.remove('jsGridView');
    projectsList.classList.add('jsListView');
  });

  gridView.addEventListener('click', function () {
    gridView.classList.add('active');
    listView.classList.remove('active');
    projectsList.classList.remove('jsListView');
    projectsList.classList.add('jsGridView');
  });

  document.querySelector('.messages-btn')?.addEventListener('click', function () {
    document.querySelector('.messages-section').classList.add('show');
  });

  document.querySelector('.messages-close')?.addEventListener('click', function () {
    document.querySelector('.messages-section').classList.remove('show');
  });
})

</script>

<template>
  <div class="app-container">
    <div class="app-header">
      <div class="app-header-left">
        <span class="app-icon"></span>
        <p class="app-name">Portfolio</p>
        <div class="search-wrapper">
          <input class="search-input" placeholder="Search" type="text">
          <svg class="feather feather-search" fill="none" height="20" stroke="currentColor" stroke-linecap="round"
               stroke-linejoin="round" stroke-width="2" viewBox="0 0 24 24" width="20"
               xmlns="http://www.w3.org/2000/svg">
            <defs></defs>
            <circle cx="11" cy="11" r="8"></circle>
            <path d="M21 21l-4.35-4.35"></path>
          </svg>
        </div>
      </div>
      <div class="app-header-right">
        <button class="mode-switch" title="Switch Theme">
          <svg class="moon" fill="none" height="24" stroke="currentColor" stroke-linecap="round"
               stroke-linejoin="round" stroke-width="2" viewBox="0 0 24 24" width="24">
            <defs></defs>
            <path d="M21 12.79A9 9 0 1111.21 3 7 7 0 0021 12.79z"></path>
          </svg>
        </button>
        <button class="add-btn" title="Add New Project">
          <svg class="btn-icon feather feather-plus" fill="none" height="16" stroke="currentColor"
               stroke-linecap="round" stroke-linejoin="round" stroke-width="3" viewBox="0 0 24 24" width="16"
               xmlns="http://www.w3.org/2000/svg">
            <line x1="12" x2="12" y1="5" y2="19"/>
            <line x1="5" x2="19" y1="12" y2="12"/>
          </svg>
        </button>
        <button class="notification-btn">
          <svg class="feather feather-bell" fill="none" height="24" stroke="currentColor" stroke-linecap="round"
               stroke-linejoin="round" stroke-width="2" viewBox="0 0 24 24" width="24"
               xmlns="http://www.w3.org/2000/svg">
            <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"/>
            <path d="M13.73 21a2 2 0 0 1-3.46 0"/>
          </svg>
        </button>
        <button class="profile-btn">
          <img src="https://assets.codepen.io/3306515/IMG_2025.jpg"/>
          <span>Aybüke C.</span>
        </button>
      </div>
      <button class="messages-btn">
        <svg class="feather feather-message-circle" fill="none" height="20" stroke="currentColor" stroke-linecap="round"
             stroke-linejoin="round" stroke-width="2" viewBox="0 0 24 24" width="20"
             xmlns="http://www.w3.org/2000/svg">
          <path
              d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z"/>
        </svg>
      </button>
    </div>
    <div class="app-content">
      <div class="projects-section">
        <div class="projects-section-header">
          <p>Projects</p>
          <p class="time">December, 12</p>
        </div>
        <div class="projects-section-line">
          <div class="projects-status">
            <div class="item-status">
              <span class="status-number">45</span>
              <span class="status-type">In Progress</span>
            </div>
            <div class="item-status">
              <span class="status-number">24</span>
              <span class="status-type">Upcoming</span>
            </div>
            <div class="item-status">
              <span class="status-number">62</span>
              <span class="status-type">Total Projects</span>
            </div>
          </div>
          <div class="view-actions">
            <button class="view-btn list-view" title="List View">
              <svg class="feather feather-list" fill="none" height="24" stroke="currentColor" stroke-linecap="round"
                   stroke-linejoin="round" stroke-width="2" viewBox="0 0 24 24" width="24"
                   xmlns="http://www.w3.org/2000/svg">
                <line x1="8" x2="21" y1="6" y2="6"/>
                <line x1="8" x2="21" y1="12" y2="12"/>
                <line x1="8" x2="21" y1="18" y2="18"/>
                <line x1="3" x2="3.01" y1="6" y2="6"/>
                <line x1="3" x2="3.01" y1="12" y2="12"/>
                <line x1="3" x2="3.01" y1="18" y2="18"/>
              </svg>
            </button>
            <button class="view-btn grid-view active" title="Grid View">
              <svg class="feather feather-grid" fill="none" height="20" stroke="currentColor" stroke-linecap="round"
                   stroke-linejoin="round" stroke-width="2" viewBox="0 0 24 24" width="20"
                   xmlns="http://www.w3.org/2000/svg">
                <rect height="7" width="7" x="3" y="3"/>
                <rect height="7" width="7" x="14" y="3"/>
                <rect height="7" width="7" x="14" y="14"/>
                <rect height="7" width="7" x="3" y="14"/>
              </svg>
            </button>
          </div>
        </div>
        <div class="project-boxes jsGridView">
          <div class="project-box-wrapper">
            <div class="project-box" style="background-color: #fee4cb;">
              <div class="project-box-header">
                <span>December 10, 2020</span>
                <div class="more-wrapper">
                  <button class="project-btn-more">
                    <svg class="feather feather-more-vertical" fill="none" height="24" stroke="currentColor"
                         stroke-linecap="round"
                         stroke-linejoin="round" stroke-width="2" viewBox="0 0 24 24" width="24"
                         xmlns="http://www.w3.org/2000/svg">
                      <circle cx="12" cy="12" r="1"/>
                      <circle cx="12" cy="5" r="1"/>
                      <circle cx="12" cy="19" r="1"/>
                    </svg>
                  </button>
                </div>
              </div>
              <div class="project-box-content-header">
                <p class="box-content-header">Web Designing</p>
                <p class="box-content-subheader">Prototyping</p>
              </div>
              <div class="box-progress-wrapper">
                <p class="box-progress-header">Progress</p>
                <div class="box-progress-bar">
                  <span class="box-progress" style="width: 60%; background-color: #ff942e"></span>
                </div>
                <p class="box-progress-percentage">60%</p>
              </div>
              <div class="project-box-footer">
                <div class="participants">
                  <img
                      alt="participant"
                      src="https://images.unsplash.com/photo-1438761681033-6461ffad8d80?ixid=MXwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHw%3D&ixlib=rb-1.2.1&auto=format&fit=crop&w=2550&q=80">
                  <img
                      alt="participant"
                      src="https://images.unsplash.com/photo-1503023345310-bd7c1de61c7d?ixid=MXwxMjA3fDB8MHxzZWFyY2h8MTB8fG1hbnxlbnwwfHwwfA%3D%3D&ixlib=rb-1.2.1&auto=format&fit=crop&w=900&q=60">
                  <button class="add-participant" style="color: #ff942e;">
                    <svg class="feather feather-plus" fill="none" height="12" stroke="currentColor"
                         stroke-linecap="round"
                         stroke-linejoin="round" stroke-width="3" viewBox="0 0 24 24" width="12"
                         xmlns="http://www.w3.org/2000/svg">
                      <path d="M12 5v14M5 12h14"/>
                    </svg>
                  </button>
                </div>
                <div class="days-left" style="color: #ff942e;">
                  2 Days Left
                </div>
              </div>
            </div>
          </div>
          <div class="project-box-wrapper">
            <div class="project-box" style="background-color: #e9e7fd;">
              <div class="project-box-header">
                <span>December 10, 2020</span>
                <div class="more-wrapper">
                  <button class="project-btn-more">
                    <svg class="feather feather-more-vertical" fill="none" height="24" stroke="currentColor"
                         stroke-linecap="round"
                         stroke-linejoin="round" stroke-width="2" viewBox="0 0 24 24" width="24"
                         xmlns="http://www.w3.org/2000/svg">
                      <circle cx="12" cy="12" r="1"/>
                      <circle cx="12" cy="5" r="1"/>
                      <circle cx="12" cy="19" r="1"/>
                    </svg>
                  </button>
                </div>
              </div>
              <div class="project-box-content-header">
                <p class="box-content-header">Testing</p>
                <p class="box-content-subheader">Prototyping</p>
              </div>
              <div class="box-progress-wrapper">
                <p class="box-progress-header">Progress</p>
                <div class="box-progress-bar">
                  <span class="box-progress" style="width: 50%; background-color: #4f3ff0"></span>
                </div>
                <p class="box-progress-percentage">50%</p>
              </div>
              <div class="project-box-footer">
                <div class="participants">
                  <img
                      alt="participant"
                      src="https://images.unsplash.com/photo-1596815064285-45ed8a9c0463?ixid=MXwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHw%3D&ixlib=rb-1.2.1&auto=format&fit=crop&w=1215&q=80">
                  <img
                      alt="participant"
                      src="https://images.unsplash.com/photo-1583195764036-6dc248ac07d9?ixid=MXwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHw%3D&ixlib=rb-1.2.1&auto=format&fit=crop&w=2555&q=80">
                  <button class="add-participant" style="color: #4f3ff0;">
                    <svg class="feather feather-plus" fill="none" height="12" stroke="currentColor"
                         stroke-linecap="round"
                         stroke-linejoin="round" stroke-width="3" viewBox="0 0 24 24" width="12"
                         xmlns="http://www.w3.org/2000/svg">
                      <path d="M12 5v14M5 12h14"/>
                    </svg>
                  </button>
                </div>
                <div class="days-left" style="color: #4f3ff0;">
                  2 Days Left
                </div>
              </div>
            </div>
          </div>
          <div class="project-box-wrapper">
            <div class="project-box">
              <div class="project-box-header">
                <span>December 10, 2020</span>
                <div class="more-wrapper">
                  <button class="project-btn-more">
                    <svg class="feather feather-more-vertical" fill="none" height="24" stroke="currentColor"
                         stroke-linecap="round"
                         stroke-linejoin="round" stroke-width="2" viewBox="0 0 24 24" width="24"
                         xmlns="http://www.w3.org/2000/svg">
                      <circle cx="12" cy="12" r="1"/>
                      <circle cx="12" cy="5" r="1"/>
                      <circle cx="12" cy="19" r="1"/>
                    </svg>
                  </button>
                </div>
              </div>
              <div class="project-box-content-header">
                <p class="box-content-header">Svg Animations</p>
                <p class="box-content-subheader">Prototyping</p>
              </div>
              <div class="box-progress-wrapper">
                <p class="box-progress-header">Progress</p>
                <div class="box-progress-bar">
                  <span class="box-progress" style="width: 80%; background-color: #096c86"></span>
                </div>
                <p class="box-progress-percentage">80%</p>
              </div>
              <div class="project-box-footer">
                <div class="participants">
                  <img
                      alt="participant"
                      src="https://images.unsplash.com/photo-1587628604439-3b9a0aa7a163?ixid=MXwxMjA3fDB8MHxzZWFyY2h8MjR8fHdvbWFufGVufDB8fDB8&ixlib=rb-1.2.1&auto=format&fit=crop&w=900&q=60">
                  <img
                      alt="participant"
                      src="https://images.unsplash.com/photo-1596815064285-45ed8a9c0463?ixid=MXwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHw%3D&ixlib=rb-1.2.1&auto=format&fit=crop&w=1215&q=80">
                  <button class="add-participant" style="color: #096c86;">
                    <svg class="feather feather-plus" fill="none" height="12" stroke="currentColor"
                         stroke-linecap="round"
                         stroke-linejoin="round" stroke-width="3" viewBox="0 0 24 24" width="12"
                         xmlns="http://www.w3.org/2000/svg">
                      <path d="M12 5v14M5 12h14"/>
                    </svg>
                  </button>
                </div>
                <div class="days-left" style="color: #096c86;">
                  2 Days Left
                </div>
              </div>
            </div>
          </div>
          <div class="project-box-wrapper">
            <div class="project-box" style="background-color: #ffd3e2;">
              <div class="project-box-header">
                <span>December 10, 2020</span>
                <div class="more-wrapper">
                  <button class="project-btn-more">
                    <svg class="feather feather-more-vertical" fill="none" height="24" stroke="currentColor"
                         stroke-linecap="round"
                         stroke-linejoin="round" stroke-width="2" viewBox="0 0 24 24" width="24"
                         xmlns="http://www.w3.org/2000/svg">
                      <circle cx="12" cy="12" r="1"/>
                      <circle cx="12" cy="5" r="1"/>
                      <circle cx="12" cy="19" r="1"/>
                    </svg>
                  </button>
                </div>
              </div>
              <div class="project-box-content-header">
                <p class="box-content-header">UI Development</p>
                <p class="box-content-subheader">Prototyping</p>
              </div>
              <div class="box-progress-wrapper">
                <p class="box-progress-header">Progress</p>
                <div class="box-progress-bar">
                  <span class="box-progress" style="width: 20%; background-color: #df3670"></span>
                </div>
                <p class="box-progress-percentage">20%</p>
              </div>
              <div class="project-box-footer">
                <div class="participants">
                  <img
                      alt="participant"
                      src="https://images.unsplash.com/photo-1600486913747-55e5470d6f40?ixid=MXwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHw%3D&ixlib=rb-1.2.1&auto=format&fit=crop&w=2550&q=80">
                  <img
                      alt="participant"
                      src="https://images.unsplash.com/photo-1587628604439-3b9a0aa7a163?ixid=MXwxMjA3fDB8MHxzZWFyY2h8MjR8fHdvbWFufGVufDB8fDB8&ixlib=rb-1.2.1&auto=format&fit=crop&w=900&q=60">
                  <button class="add-participant" style="color: #df3670;">
                    <svg class="feather feather-plus" fill="none" height="12" stroke="currentColor"
                         stroke-linecap="round"
                         stroke-linejoin="round" stroke-width="3" viewBox="0 0 24 24" width="12"
                         xmlns="http://www.w3.org/2000/svg">
                      <path d="M12 5v14M5 12h14"/>
                    </svg>
                  </button>
                </div>
                <div class="days-left" style="color: #df3670;">
                  2 Days Left
                </div>
              </div>
            </div>
          </div>
          <div class="project-box-wrapper">
            <div class="project-box" style="background-color: #c8f7dc;">
              <div class="project-box-header">
                <span>December 10, 2020</span>
                <div class="more-wrapper">
                  <button class="project-btn-more">
                    <svg class="feather feather-more-vertical" fill="none" height="24" stroke="currentColor"
                         stroke-linecap="round"
                         stroke-linejoin="round" stroke-width="2" viewBox="0 0 24 24" width="24"
                         xmlns="http://www.w3.org/2000/svg">
                      <circle cx="12" cy="12" r="1"/>
                      <circle cx="12" cy="5" r="1"/>
                      <circle cx="12" cy="19" r="1"/>
                    </svg>
                  </button>
                </div>
              </div>
              <div class="project-box-content-header">
                <p class="box-content-header">Data Analysis</p>
                <p class="box-content-subheader">Prototyping</p>
              </div>
              <div class="box-progress-wrapper">
                <p class="box-progress-header">Progress</p>
                <div class="box-progress-bar">
                  <span class="box-progress" style="width: 60%; background-color: #34c471"></span>
                </div>
                <p class="box-progress-percentage">60%</p>
              </div>
              <div class="project-box-footer">
                <div class="participants">
                  <img
                      alt="participant"
                      src="https://images.unsplash.com/photo-1438761681033-6461ffad8d80?ixid=MXwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHw%3D&ixlib=rb-1.2.1&auto=format&fit=crop&w=2550&q=80">
                  <img
                      alt="participant"
                      src="https://images.unsplash.com/photo-1503023345310-bd7c1de61c7d?ixid=MXwxMjA3fDB8MHxzZWFyY2h8MTB8fG1hbnxlbnwwfHwwfA%3D%3D&ixlib=rb-1.2.1&auto=format&fit=crop&w=900&q=60">
                  <button class="add-participant" style="color: #34c471;">
                    <svg class="feather feather-plus" fill="none" height="12" stroke="currentColor"
                         stroke-linecap="round"
                         stroke-linejoin="round" stroke-width="3" viewBox="0 0 24 24" width="12"
                         xmlns="http://www.w3.org/2000/svg">
                      <path d="M12 5v14M5 12h14"/>
                    </svg>
                  </button>
                </div>
                <div class="days-left" style="color: #34c471;">
                  2 Days Left
                </div>
              </div>
            </div>
          </div>
          <div class="project-box-wrapper">
            <div class="project-box" style="background-color: #d5deff;">
              <div class="project-box-header">
                <span>December 10, 2020</span>
                <div class="more-wrapper">
                  <button class="project-btn-more">
                    <svg class="feather feather-more-vertical" fill="none" height="24" stroke="currentColor"
                         stroke-linecap="round"
                         stroke-linejoin="round" stroke-width="2" viewBox="0 0 24 24" width="24"
                         xmlns="http://www.w3.org/2000/svg">
                      <circle cx="12" cy="12" r="1"/>
                      <circle cx="12" cy="5" r="1"/>
                      <circle cx="12" cy="19" r="1"/>
                    </svg>
                  </button>
                </div>
              </div>
              <div class="project-box-content-header">
                <p class="box-content-header">Web Designing</p>
                <p class="box-content-subheader">Prototyping</p>
              </div>
              <div class="box-progress-wrapper">
                <p class="box-progress-header">Progress</p>
                <div class="box-progress-bar">
                  <span class="box-progress" style="width: 40%; background-color: #4067f9"></span>
                </div>
                <p class="box-progress-percentage">40%</p>
              </div>
              <div class="project-box-footer">
                <div class="participants">
                  <img
                      alt="participant"
                      src="https://images.unsplash.com/photo-1600486913747-55e5470d6f40?ixid=MXwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHw%3D&ixlib=rb-1.2.1&auto=format&fit=crop&w=2550&q=80">
                  <img
                      alt="participant"
                      src="https://images.unsplash.com/photo-1583195764036-6dc248ac07d9?ixid=MXwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHw%3D&ixlib=rb-1.2.1&auto=format&fit=crop&w=2555&q=80">
                  <button class="add-participant" style="color: #4067f9;">
                    <svg class="feather feather-plus" fill="none" height="12" stroke="currentColor"
                         stroke-linecap="round"
                         stroke-linejoin="round" stroke-width="3" viewBox="0 0 24 24" width="12"
                         xmlns="http://www.w3.org/2000/svg">
                      <path d="M12 5v14M5 12h14"/>
                    </svg>
                  </button>
                </div>
                <div class="days-left" style="color: #4067f9;">
                  2 Days Left
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style lang="scss" >
@import "index";
</style>
